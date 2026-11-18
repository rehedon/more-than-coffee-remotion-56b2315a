import {useId} from 'react'
import {AbsoluteFill, staticFile} from 'remotion'

export const Stage = () => (
  <AbsoluteFill style={{background: [
    'radial-gradient(ellipse 81% 49% at 50% 51%, #e5efeb 4%, #e1ebe7 40%, #c7cfcb 77%, #a6aba9 100%)',
    '#adb3b0',
  ].join(', ')}} />
)

export const Watermark = ({
  x, y, size, opacity = 0.17, angle = 0,
}: {
  x: number
  y: number
  size: number
  opacity?: number
  angle?: number
}) => (
  <img alt="" decoding="sync"
    src={staticFile('siren-watermark.svg')}
    style={{
      position: 'absolute', left: x - size / 2, top: y - size / 2, width: size,
      transform: `rotate(${angle}deg)`, opacity, filter: 'blur(1px)',
    }}
  />
)

const ribbonPaths = {
  opening: 'M -88 348 C 28 525 162 601 348 646 S 617 724 810 901',
  shop: 'M 813 313 C 622 392 519 465 397 659 S 134 1017 -100 1037',
  cards: 'M -72 218 C 113 471 207 517 365 531 S 639 629 802 852',
}

export const Ribbon = ({shape, draw}: {shape: keyof typeof ribbonPaths; draw: number}) => (
  <svg width="720" height="1280" aria-hidden style={{position: 'absolute', inset: 0}}>
    <path d={ribbonPaths[shape]} pathLength={1} fill="none" stroke="#005b38"
      strokeWidth={shape === 'opening' ? 72 : 58} strokeLinecap="round"
      strokeDasharray="1 2" strokeDashoffset={1 - draw} />
  </svg>
)

export const Petals = ({
  x, y, rotation, scale = 1,
}: {
  x: number
  y: number
  rotation: number
  scale?: number
}) => (
  <svg
    width={480} height={480} viewBox="-240 -240 480 480" aria-hidden
    style={{
      position: 'absolute', left: x - 240, top: y - 240, overflow: 'visible',
      transform: `rotate(${rotation}deg) scale(${scale})`,
      filter: 'blur(4.5px) drop-shadow(12px 21px 16px #1a242356)',
    }}
  >
    {[0, 67, 134, 201, 268].map((angle) => (
      <path key={angle} transform={`rotate(${angle})`} fill="#181b1b"
        d="M -7 10 C -23 -36 -40 -107 -37 -178 C -37 -216 -17 -239 3 -238 C 22 -237 35 -216 34 -184 C 34 -125 20 -51 7 10 Z" />
    ))}
  </svg>
)

export const PaperCup = ({
  x, y, width, angle = 0, soft = 1,
}: {
  x: number
  y: number
  width: number
  angle?: number
  soft?: number
}) => {
  const id = useId()
  const scale = width / 220
  const height = 380 * scale

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      transform: `rotate(${angle}deg)`,
      filter: `drop-shadow(${16 * scale}px ${20 * scale}px ${11 * scale * soft}px #19262353) drop-shadow(${11 * scale}px ${8 * scale}px ${7 * scale}px #23333040)`,
    }}>
      <svg width={width} height={height} viewBox="0 0 220 380" aria-hidden>
        <defs>
          <linearGradient id={`${id}-paper`}>
            <stop offset="0" stopColor="#cacac3" />
            <stop offset=".18" stopColor="#e9e8e1" />
            <stop offset=".56" stopColor="#f2f1eb" />
            <stop offset=".86" stopColor="#e7e6df" />
            <stop offset="1" stopColor="#c2c2b9" />
          </linearGradient>
          <linearGradient id={`${id}-shade`} x2="0" y2="1">
            <stop offset="0" stopColor="#837e6c" stopOpacity=".43" />
            <stop offset=".12" stopColor="#d8d7ce" stopOpacity=".16" />
            <stop offset=".9" stopColor="#f7f8f4" stopOpacity=".03" />
            <stop offset="1" stopColor="#ffffff" stopOpacity=".35" />
          </linearGradient>
          <linearGradient id={`${id}-lid`} x2=".28" y2="1">
            <stop offset="0" stopColor="#f8f8f5" />
            <stop offset=".63" stopColor="#fcfcfa" />
            <stop offset="1" stopColor="#d8d7cc" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id}-paper)`} d="M 17 52 L 203 51 L 171 361 Q 167 369 110 370 Q 55 370 47 361 Z" />
        <path fill={`url(#${id}-shade)`} d="M 17 52 L 203 51 L 171 361 Q 167 369 110 370 Q 55 370 47 361 Z" />
        <path fill={`url(#${id}-lid)`}
          d="M 9 49 Q 10 42 21 39 L 27 17 Q 29 12 40 10 Q 109 1 178 10 Q 190 12 192 20 L 198 39 Q 209 40 211 48 L 211 55 Q 203 60 111 60 Q 24 60 10 56 Z" />
        <path fill="#fff" opacity=".55" d="M 12 47 C 33 52 188 51 207 45 L 207 49 C 186 56 32 57 12 52 Z" />
        <image href={staticFile('siren.svg')} x={51} y={120} width={118} height={119} opacity=".96" />
        <text x="110" y="307" fill="#47544d" textAnchor="middle" fontFamily="sans-serif" fontSize="4.8">
          <tspan x="110">Reusable. Recyclable.</tspan>
          <tspan x="110" dy="6">Re-enjoyable.</tspan>
        </text>
      </svg>
    </div>
  )
}
