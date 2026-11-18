import {Composition, registerRoot} from 'remotion'
import {MoreThanCoffee} from './MoreThanCoffee'
import {FPS, FRAMES, HEIGHT, WIDTH} from './timeline'

function Root() {
  return (
    <Composition
      id="MoreThanCoffee"
      component={MoreThanCoffee}
      durationInFrames={FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  )
}

registerRoot(Root)
