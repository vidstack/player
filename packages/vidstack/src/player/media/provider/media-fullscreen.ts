import { isUndefined } from 'maverick.js/std';

import type { UseFullscreenProps } from '../../../foundation/fullscreen/use-fullscreen';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import type { UseScreenOrientation } from '../../../foundation/orientation/use-screen-orientation';

export function withMediaFullscreenOptions(props: {
  lockType: ScreenOrientationLockType | undefined;
  orientation: UseScreenOrientation;
}): Omit<UseFullscreenProps, '$target'> {
  let orientationLocked = false;
  return {
    async onBeforeRequest() {
      // TODO: Check if PiP is active, if so make sure to exit.
      if (props.orientation.supported && !isUndefined(props.lockType)) {
        await props.orientation.lock(props.lockType);
        orientationLocked = true;
      }
    },
    async onBeforeExit() {
      if (orientationLocked) {
        await props.orientation.unlock();
        orientationLocked = false;
      }
    },
  };
}
