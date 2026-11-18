import {execFile} from 'node:child_process'
import {mkdir, mkdtemp, readdir, rename, rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join, resolve} from 'node:path'
import {promisify} from 'node:util'
import {bundle} from '@remotion/bundler'
import {openBrowser, renderFrames, selectComposition} from '@remotion/renderer'

const run = promisify(execFile)
const output = resolve('out/MoreThanCoffee.mp4')
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg'
await run(ffmpeg, ['-version']).catch((error) => {
  if (error.code === 'ENOENT') throw new Error('The compatibility renderer needs FFmpeg in PATH or FFMPEG_PATH.')
  throw error
})
await run('pdftoppm', ['-v']).catch((error) => {
  if (error.code === 'ENOENT') {
    throw new Error('The compatibility renderer needs pdftoppm from Poppler in PATH.')
  }
  throw error
})
await mkdir('out', {recursive: true})
const scratch = await mkdtemp(join(tmpdir(), 'more-than-coffee-'))
let browser

try {
  browser = await openBrowser('chrome', {logLevel: 'warn'})
  // On hosts where Chromium's compositor clock stalls, let the JavaScript frame queue finish.
  const newPage = browser.newPage.bind(browser)
  browser.newPage = async (options) => {
    const page = await newPage(options)
    await page.evaluateOnNewDocument(() => {
      const request = window.requestAnimationFrame.bind(window)
      const cancel = window.cancelAnimationFrame.bind(window)
      const timers = new Map()
      window.requestAnimationFrame = (callback) => {
        const id = request((timestamp) => {
          clearTimeout(timers.get(id))
          timers.delete(id)
          callback(timestamp)
        })
        timers.set(id, setTimeout(() => {
          cancel(id)
          timers.delete(id)
          callback(performance.now())
        }, 40))
        return id
      }
      window.cancelAnimationFrame = (id) => {
        clearTimeout(timers.get(id))
        timers.delete(id)
        cancel(id)
      }
    })
    return page
  }

  const serveUrl = await bundle({entryPoint: resolve('src/index.tsx')})
  const puppeteerInstance = browser
  const composition = await selectComposition({serveUrl, id: 'MoreThanCoffee', puppeteerInstance})
  const {width, height, fps} = composition
  const {assetsInfo} = await renderFrames({
    serveUrl, composition, puppeteerInstance, outputDir: scratch, imageFormat: 'pdf',
    muted: true, concurrency: 4, logLevel: 'warn',
    onStart: ({frameCount}) => console.log(`Rendering ${frameCount} frames`),
    onFrameUpdate: (count) => {
      if (count % 90 === 0 || count === composition.durationInFrames) console.log(`Rendered ${count} frames`)
    },
  })

  const frames = (await readdir(scratch)).filter((file) => file.endsWith('.pdf')).sort()
  if (frames.length !== composition.durationInFrames) throw new Error('Incomplete frame sequence.')
  for (let index = 0; index < frames.length; index += 4) {
    await Promise.all(frames.slice(index, index + 4).map(async (file) => {
      const pdf = join(scratch, file)
      await run('pdftoppm', ['-f', '1', '-l', '1', '-singlefile', '-scale-to-x', String(width),
        '-scale-to-y', String(height), '-jpeg', '-jpegopt', 'quality=98', pdf, pdf.slice(0, -4)])
      await rm(pdf)
    }))
  }

  const movie = join(scratch, 'MoreThanCoffee.mp4')
  await run(ffmpeg, [
    '-loglevel', 'error', '-framerate', String(fps), '-start_number', String(assetsInfo.firstFrameIndex),
    '-i', assetsInfo.imageSequenceName.replace(/\.pdf$/, '.jpg'), '-i', resolve('public/score.wav'),
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'libx264', '-crf', '17', '-vf', 'setsar=1',
    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart',
    '-t', String(composition.durationInFrames / fps), movie,
  ])
  await rename(movie, output)
  console.log(output)
} finally {
  await browser?.close({silent: true})
  await rm(scratch, {recursive: true, force: true})
}
