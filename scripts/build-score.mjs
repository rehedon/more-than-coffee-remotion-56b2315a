import {writeFileSync} from 'node:fs'

const sampleRate = 44_100
const length = Math.round(sampleRate * 361 / 30)
const samples = new Float32Array(length)
const frequency = (note) => 440 * 2 ** ((note - 69) / 12)
const tau = Math.PI * 2
let seed = 713

const noise = () => {
  seed = (Math.imul(1664525, seed) + 1013904223) >>> 0
  return seed / 0x80000000 - 1
}

const add = (start, duration, voice) => {
  const offset = Math.floor(start * sampleRate)
  const end = Math.min(length - offset, Math.floor(duration * sampleRate))
  for (let index = 0; index < end; index++) {
    samples[index + offset] += voice(index / sampleRate)
  }
}

const attack = (time, seconds) => Math.min(1, time / seconds)

const tone = (start, note, level, decay) => {
  const pitch = frequency(note)
  add(start, decay * 6, (time) => {
    const fundamental = Math.sin(tau * pitch * time)
    const harmonic = Math.sin(tau * pitch * 2 * time) * 0.2 * Math.exp(-time * 9)
    const tine = Math.sin(tau * pitch * 3.01 * time) * 0.09 * Math.exp(-time * 19)
    return (fundamental + harmonic + tine) * Math.exp(-time / decay) * attack(time, 0.012) * level
  })
}

const beat = 0.42
const chords = [
  [45, 57, 60, 64, 67], [41, 57, 60, 64, 65],
  [48, 55, 59, 64, 67], [43, 55, 59, 62, 69],
]

for (let measure = 0; measure < 8; measure++) {
  const start = measure * beat * 4 + 0.12
  const chord = chords[measure % chords.length]
  tone(start, chord[0] - 12, 0.091, 0.29)
  tone(start + beat * 2.5, chord[0], 0.047, 0.16)
  for (let index = 1; index < chord.length; index++) {
    tone(start + (index - 1) * beat * 0.51, chord[index], 0.031, 0.37)
    tone(start + (index + 0.6) * beat * 0.51, chord[index], 0.016, 0.23)
  }
  for (let tick = 0; tick < 8; tick++) {
    const at = start + tick * beat / 2
    let previous = 0
    add(at, 0.075, (time) => {
      const current = noise()
      const filtered = current - previous
      previous = current
      return filtered * Math.exp(-time * 55) * attack(time, 0.004) * (tick % 2 ? 0.012 : 0.024)
    })
    if (tick === 0 || tick === 4) {
      add(at, 0.28, (time) => (
        Math.sin(tau * (47 * time + 2.3 * (1 - Math.exp(-time * 27)))) *
        Math.exp(-time * 21) * attack(time, 0.004) * 0.15
      ))
    }
  }
}

for (const frame of [68, 103, 173, 205, 243, 274, 305]) {
  let low = 0
  add(frame / 30 - 0.105, 0.24, (time) => {
    low += (noise() - low) * 0.12
    return low * Math.sin(Math.PI * time / 0.24) ** 2 * 0.084
  })
}
for (const [frame, note] of [[22, 76], [51, 72], [91, 79], [122, 76], [205, 81], [246, 79], [305, 76], [316, 84]]) {
  tone(frame / 30, note, 0.041, 0.29)
}

const wav = Buffer.alloc(44 + length * 2)
wav.write('RIFF')
wav.writeUInt32LE(wav.length - 8, 4)
wav.write('WAVEfmt ', 8)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(sampleRate, 24)
wav.writeUInt32LE(sampleRate * 2, 28)
wav.writeUInt16LE(2, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(length * 2, 40)
for (let index = 0; index < length; index++) {
  const fade = Math.min(1, (length - index) / (sampleRate * 0.45))
  wav.writeInt16LE(Math.round(Math.tanh(samples[index] * 1.5) * fade * 32767), 44 + index * 2)
}
writeFileSync(new URL('../public/score.wav', import.meta.url), wav)
