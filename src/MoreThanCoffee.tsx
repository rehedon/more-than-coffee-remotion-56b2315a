import {type ReactNode, useEffect, useId, useState} from 'react'
import {AbsoluteFill, Audio, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion'
import {PaperCup, Petals, Ribbon, Stage, Watermark} from './Artwork'
import {CUT, easeIn, keyframes, progress} from './timeline'

const fonts = [
  {name: 'Motion Inter', file: 'inter-italic.woff2', style: 'italic', weight: '300 500'},
  {name: 'Motion Serif', file: 'source-serif-italic.woff2', style: 'italic', weight: '600'},
  {name: 'Motion Script', file: 'caveat.woff2', style: 'normal', weight: '500'},
]

const photoFiles = {
  shop: 'shop.webp',
  morning: 'morning.webp',
  cafe: 'cafe.webp',
  work: 'work.webp',
}

const artwork = [
  'siren.svg', 'siren-watermark.svg', 'drinks.webp',
  ...Object.values(photoFiles).map((file) => `cards/${file}`),
]

const useLocalAssets = () => {
  const [handle] = useState(() => delayRender('Loading fonts and artwork'))
  useEffect(() => {
    const loadFonts = fonts.map(async ({name, file, style, weight}) => {
      const font = new FontFace(name, `url("${staticFile(`fonts/${file}`)}")`, {style, weight})
      document.fonts.add(await font.load())
    })
    const loadImages = artwork.map((file) => new Promise<void>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve()
      image.onerror = () => reject(new Error(`Unable to load ${file}`))
      image.src = staticFile(file)
    }))
    Promise.all([...loadFonts, ...loadImages]).then(() => continueRender(handle), cancelRender)
  }, [handle])
}

const Word = ({
  children, frame, first, x, y, size, serif = false, weight, center = false, travel = 16,
}: {
  children: string
  frame: number
  first: number
  x: number
  y: number
  size: number
  serif?: boolean
  weight?: number
  center?: boolean
  travel?: number
}) => {
  const reveal = progress(frame, first, first + 11)
  return (
    <div style={{
      position: 'absolute', left: x, top: y, minWidth: center ? 660 : undefined,
      textAlign: center ? 'center' : undefined, whiteSpace: 'nowrap',
      color: '#141e1c', fontSize: size, letterSpacing: serif ? '-.028em' : '-.032em',
      fontWeight: weight ?? (serif ? 600 : 300), fontStyle: 'italic', lineHeight: 1,
      fontFamily: serif ? '"Motion Serif", Georgia, serif' : '"Motion Inter", Arial, sans-serif',
      opacity: reveal, filter: `blur(${(1 - reveal) * 3.5}px)`,
      transform: `translate(${center ? '-50%' : '0'}, ${(1 - reveal) * travel}px)`,
    }}>{children}</div>
  )
}

const Plane = ({
  children, x = 0, y = 0, scale = 1, angle = 0, opacity = 1, blur = 0,
}: {
  children: ReactNode
  x?: number
  y?: number
  scale?: number
  angle?: number
  opacity?: number
  blur?: number
}) => (
  <AbsoluteFill style={{
    opacity, transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${angle}deg)`,
    filter: blur > 0 ? `blur(${blur}px)` : undefined, transformOrigin: '50% 50%',
  }}>{children}</AbsoluteFill>
)

const Opening = ({frame}: {frame: number}) => {
  const cupIn = progress(frame, 5, 33)
  const propsIn = progress(frame, 16, 42)
  const exit = progress(frame, 63, 71, easeIn)
  return (
    <Plane x={-38 * exit} y={-160 * exit} scale={1 + 0.12 * exit}
      angle={3 * exit} opacity={1 - exit} blur={9 * exit}>
      <Watermark x={360} y={638} size={keyframes(frame, [0, 35], [790, 667])} angle={-13} />
      <Ribbon shape="opening" draw={progress(frame, 24, 54, (t) => t)} />
      <Plane y={(1 - cupIn) * 475} opacity={progress(frame, 7, 23)} angle={(1 - cupIn) * -6}>
        <PaperCup x={246} y={468} width={196} angle={-5} />
      </Plane>
      <Plane angle={(1 - cupIn) * 17}>
        <Word frame={frame} first={10} x={375} y={327} size={43}>This is how</Word>
        <Word frame={frame} first={15} x={252} y={365} size={73} serif>Starbucks</Word>
      </Plane>
      <Word frame={frame} first={30} x={171} y={819} size={45}>built a</Word>
      <Word frame={frame} first={37} x={228} y={861} size={76} serif>lifestyle</Word>
      <Plane y={(1 - propsIn) * -110} opacity={propsIn}>
        <div style={{
          position: 'absolute', left: 57, top: 57, color: '#293430', fontWeight: 500,
          fontSize: 40, fontFamily: '"Motion Script", cursive', transform: 'rotate(-16deg)',
          borderBottom: '1px solid #29343073', lineHeight: '.9',
        }}>Coffee Study</div>
        <PaperCup x={657} y={-136} width={141} angle={39} />
      </Plane>
      <Plane y={(1 - propsIn) * 170} opacity={propsIn}>
        <PaperCup x={-129} y={1081} width={168} angle={64} />
      </Plane>
    </Plane>
  )
}

const DashRing = ({draw}: {draw: number}) => {
  const mask = useId()
  return (
    <svg style={{position: 'absolute', inset: 0}} width="720" height="1280" aria-hidden>
      <defs>
        <mask id={mask}>
          <circle cx="356" cy="632" r="201" fill="none" stroke="white" strokeWidth="9"
            pathLength="1" strokeDasharray="1 2" strokeDashoffset={1 - draw}
            transform="rotate(-90 356 632)" />
        </mask>
      </defs>
      <circle cx="356" cy="632" r="201" fill="none" stroke="#1f302c" strokeWidth="3.4"
        strokeDasharray="8 7.4" mask={`url(#${mask})`} />
    </svg>
  )
}

const Drinks = ({frame}: {frame: number}) => {
  const entry = progress(frame, CUT.drinks - 1, 76)
  const exit = progress(frame, 97, 107, easeIn)
  return (
    <Plane y={25 * (1 - entry) - 735 * exit} scale={0.94 + entry * 0.06}
      opacity={entry * (1 - progress(frame, 102, 108))} blur={6 * (1 - entry) + 6 * exit}>
      <Watermark x={357} y={621} size={523} />
      <DashRing draw={progress(frame, 72, 96, (t) => t)} />
      <img alt="" decoding="sync" src={staticFile('drinks.webp')} style={{
        position: 'absolute', left: 209, top: 452, width: 296, height: 352,
        objectFit: 'fill', filter: 'drop-shadow(17px 20px 17px #293d3680)',
      }} />
      <Word frame={frame} first={67} x={360} y={369} size={48} center>More than</Word>
      <Word frame={frame} first={78} x={354} y={832} size={65} center serif>just coffee</Word>
    </Plane>
  )
}

type Photo = keyof typeof photoFiles

const PhotoCard = ({
  photo, frame, x, y, width, height,
}: {
  photo: Photo
  frame: number
  x: number
  y: number
  width: number
  height: number
}) => {
  const camera = keyframes(frame, [CUT.morning, CUT.cafe], [0, 1])
  const movement = photo === 'morning'
    ? `translateY(${14 - 27 * camera}px) scale(${1.04 + 0.19 * camera})`
    : photo === 'work' ? `scale(${1.01 + progress(frame, CUT.work, 270) * 0.045})` : undefined
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height, overflow: 'hidden',
      borderRadius: photo === 'shop' ? 34 : 28, backgroundColor: '#253a3a',
      boxShadow: '18px 22px 32px #1a292766, 5px 7px 12px #23303046',
    }}>
      <img alt="" decoding="sync" src={staticFile(`cards/${photoFiles[photo]}`)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: movement}} />
    </div>
  )
}

const Shop = ({frame}: {frame: number}) => {
  const enter = progress(frame, CUT.shop, 124)
  const leave = progress(frame, 165, 180, easeIn)
  const y = (1 - enter) * 680 - leave * 1135 + keyframes(frame, [123, 147, 164], [10, 0, -10])
  return (
    <Plane y={y} opacity={progress(frame, CUT.shop, 109) * (1 - progress(frame, 177, 182))}
      blur={(1 - enter) * 5 + leave * 6}>
      <Ribbon shape="shop" draw={progress(frame, 109, 147, (t) => t)} />
      <PhotoCard photo="shop" frame={frame} x={129} y={360} width={475} height={715} />
      <Word frame={frame} first={108} x={360} y={308} size={43} center>They focused on experience</Word>
    </Plane>
  )
}

const montageText = {
  morning: 'Morning routines',
  cafe: 'cozy cafés',
  work: 'work sessions',
}

const Montage = ({frame}: {frame: number}) => {
  const enter = progress(frame, CUT.morning, 191)
  const leave = progress(frame, 267, 277, easeIn)
  const photo = frame < CUT.cafe ? 'morning' : frame < CUT.work ? 'cafe' : 'work'
  const flash = Math.max(
    keyframes(frame, [201, 204, 208], [0, 0.81, 0]),
    keyframes(frame, [240, 242, 245], [0, 0.29, 0]),
  )
  const y = (1 - enter) * 748 - leave * 545
  return (
    <Plane y={y} scale={1 + 0.1 * leave} blur={(1 - enter) * 5 + leave * 6}
      opacity={progress(frame, CUT.morning, 179) * (1 - progress(frame, 271, 275))}>
      <Ribbon shape="cards" draw={progress(frame, 182, 231, (t) => t)} />
      <PhotoCard photo={photo} frame={frame} x={97} y={253} width={526} height={775} />
      <Word frame={frame} first={CUT[photo] - 3} x={359} y={170} size={57} center travel={8}>
        {montageText[photo]}
      </Word>
      <div style={{
        position: 'absolute', left: 97, top: 253, width: 526, height: 775, borderRadius: 28,
        background: 'radial-gradient(ellipse at 47% 34%, #fff, #fff4d7c9 42%, #fff2e250 84%)',
        opacity: flash, mixBlendMode: 'screen',
      }} />
    </Plane>
  )
}

const ReturnCup = ({frame}: {frame: number}) => {
  const enter = progress(frame, CUT.returnCup - 2, 281)
  const exit = progress(frame, 301, CUT.finale + 1, easeIn)
  return (
    <Plane opacity={enter * (1 - exit)} blur={(1 - enter) * 7 + exit * 9} scale={0.94 + 0.06 * enter + 0.24 * exit}>
      <Watermark x={361} y={622} size={528} />
      <PaperCup x={255} y={454} width={207} />
      <Word frame={frame} first={274} x={356} y={344} size={50} center>It wasn’t</Word>
      <Word frame={frame} first={285} x={229} y={859} size={48}>about</Word>
      <Word frame={frame} first={291} x={262} y={887} size={95} serif>coffee</Word>
    </Plane>
  )
}

const Finale = ({frame}: {frame: number}) => {
  const entry = progress(frame, CUT.finale - 1, 309)
  const drift = progress(frame, 346, 360, (t) => t)
  return (
    <Plane x={-18 + 18 * entry + 17 * drift} y={10 * drift} scale={1.025 - 0.025 * entry}
      blur={5 * (1 - entry)} opacity={entry}>
      <Watermark x={43} y={622} size={1280} opacity={0.20} angle={-9} />
      <PaperCup x={-332} y={169} width={616} angle={3} soft={1.45} />
      <Word frame={frame} first={306} x={319} y={378} size={87}>It was</Word>
      <Word frame={frame} first={309} x={373} y={447} size={95} weight={500}>about</Word>
      <Word frame={frame} first={315} x={358} y={553} size={49}>the</Word>
      <Word frame={frame} first={317} x={267} y={549} size={139} serif>feeling</Word>
    </Plane>
  )
}

const BorderPetals = ({frame}: {frame: number}) => {
  if (frame < 67) return null

  const lift = progress(frame, 97, 109, easeIn)
  const finishLift = progress(frame, 106, 117)
  const leaveShop = progress(frame, 166, 185, easeIn)
  const rightEntry = progress(frame, 110, 125)
  return frame < 187 ? (
    <>
      {frame < 109 && <Petals x={733} y={-17 + 102 * (1 - progress(frame, 68, 75)) - 307 * lift}
        rotation={199 + 21 * lift} scale={1.03} />}
      <Petals x={-21 - 17 * finishLift} y={1292 - 860 * lift - 450 * finishLift - 450 * leaveShop}
        rotation={46 + 102 * finishLift} scale={1.23} />
      {frame >= 110 && <Petals x={736} y={1375 - 107 * rightEntry - 1310 * leaveShop}
        rotation={-8 + 206 * leaveShop} scale={1.07} />}
    </>
  ) : (
    <Petals x={734} y={keyframes(frame, [187, 191, 240, 270, 299, 324, 360], [-22, -19, -40, -12, -15, -49, -28])}
      rotation={keyframes(frame, [187, 191, 241, 268, 302, 360], [201, 201, 193, 209, 222, 203])}
      scale={1.04} />
  )
}

export const MoreThanCoffee = () => {
  const frame = useCurrentFrame()
  useLocalAssets()
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Stage />
      {frame < 71 && <Opening frame={frame} />}
      {frame >= CUT.drinks - 1 && frame < 108 && <Drinks frame={frame} />}
      {frame >= CUT.shop && frame < 182 && <Shop frame={frame} />}
      {frame >= CUT.morning && frame < 275 && <Montage frame={frame} />}
      {frame >= CUT.returnCup - 2 && frame < 306 && <ReturnCup frame={frame} />}
      {frame >= CUT.finale - 1 && <Finale frame={frame} />}
      <BorderPetals frame={frame} />
      <Audio src={staticFile('score.wav')} />
    </AbsoluteFill>
  )
}
