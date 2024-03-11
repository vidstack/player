import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { FullscreenButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * FullscreenButton
 * -----------------------------------------------------------------------------------------------*/

const FullscreenButtonBridge = createReactComponent(FullscreenButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface FullscreenButtonProps
  extends ReactElementProps<FullscreenButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the fullscreen mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/fullscreen-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen}
 * @example
 * ```tsx
 * const isActive = useMediaState('fullscreen');
 *
 * <FullscreenButton>
 *   {!isActive ? <EnterIcon /> : <ExitIcon />}
 * </FullscreenButton>
 * ```
 */
const FullscreenButton = React.forwardRef<HTMLButtonElement, FullscreenButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <FullscreenButtonBridge {...(props as Omit<FullscreenButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </FullscreenButtonBridge>
    );
  },
);

FullscreenButton.displayName = 'FullscreenButton';
export { FullscreenButton };
