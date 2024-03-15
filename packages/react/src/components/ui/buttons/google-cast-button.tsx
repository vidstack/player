import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { GoogleCastButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * GoogleCastButton
 * -----------------------------------------------------------------------------------------------*/

const GoogleCastButtonBridge = createReactComponent(GoogleCastButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface GoogleCastButtonProps
  extends ReactElementProps<GoogleCastButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for requesting Google Cast.
 *
 * @see {@link https://developers.google.com/cast/docs/overview}
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/google-cast-button}
 * @example
 * ```tsx
 * <GoogleCastButton>
 *   <ChromecastIcon />
 * </GoogleCastButton>
 * ```
 */
const GoogleCastButton = React.forwardRef<HTMLButtonElement, GoogleCastButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <GoogleCastButtonBridge {...(props as Omit<GoogleCastButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </GoogleCastButtonBridge>
    );
  },
);

GoogleCastButton.displayName = 'GoogleCastButton';
export { GoogleCastButton };
