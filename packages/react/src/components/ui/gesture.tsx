import { createReactComponent, type ReactElementProps } from 'maverick.js/react';
import * as React from 'react';

import { GestureInstance } from '../primitives/instances';
import { Primitive } from '../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * Gesture
 * -----------------------------------------------------------------------------------------------*/

const GestureBridge = createReactComponent(GestureInstance);

export interface GestureProps extends ReactElementProps<GestureInstance> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<GestureInstance>;
}

/**
 * This component enables actions to be performed on the media based on user gestures.
 *
 * @docs {@link https://www.vidstack.io/docs/react/player/components/media/gesture}
 */
const Gesture = React.forwardRef<GestureInstance, GestureProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <GestureBridge {...props} ref={forwardRef}>
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </GestureBridge>
    );
  },
);

Gesture.displayName = 'Gesture';
export { Gesture };
