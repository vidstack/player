import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { PIPButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * PIPButton
 * -----------------------------------------------------------------------------------------------*/

const PIPButtonBridge = createReactComponent(PIPButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface PIPButtonProps extends ReactElementProps<PIPButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the picture-in-picture (PIP) mode of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/pip-button}
 * @see {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture}
 * @example
 * ```tsx
 * const isActive = useMediaState('pictureInPicture');
 *
 * <PIPButton>
 *   {!isActive ? <EnterIcon /> : <ExitIcon />}
 * </PIPButton>
 * ```
 */
const PIPButton = React.forwardRef<HTMLButtonElement, PIPButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <PIPButtonBridge {...(props as Omit<PIPButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </PIPButtonBridge>
    );
  },
);

PIPButton.displayName = 'PIPButton';
export { PIPButton };
