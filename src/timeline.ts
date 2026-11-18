import {Easing, interpolate} from 'remotion'

export const FPS = 30
export const WIDTH = 720
export const HEIGHT = 1280
export const FRAMES = 361

export const CUT = {
  drinks: 68,
  shop: 103,
  morning: 173,
  cafe: 205,
  work: 243,
  returnCup: 274,
  finale: 305,
}

export const easeOut = Easing.bezier(0.18, 0.8, 0.33, 1)
export const easeIn = Easing.bezier(0.54, 0.04, 0.97, 0.51)

export const keyframes = (frame: number, times: number[], values: number[]) =>
  interpolate(frame, times, values, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

export const progress = (frame: number, start: number, end: number, easing = easeOut) =>
  interpolate(frame, [start, end], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
