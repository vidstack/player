import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { AirPlayButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * AirPlayButton
 * -----------------------------------------------------------------------------------------------*/

const AirPlayButtonBridge = createReactComponent(AirPlayButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface AirPlayButtonProps
  extends ReactElementProps<AirPlayButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for requesting to connect to Apple AirPlay.
 *
 * @see {@link https://www.apple.com/au/airplay}
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/airplay-button}
 * @example
 * ```tsx
 * <AirPlayButton>
 *   <AirPlayIcon />
 * </AirPlayButton>
 * ```
 */
const AirPlayButton = React.forwardRef<HTMLButtonElement, AirPlayButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <AirPlayButtonBridge {...(props as Omit<AirPlayButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </AirPlayButtonBridge>
    );
  },
);

AirPlayButton.displayName = 'AirPlayButton';
export { AirPlayButton };
