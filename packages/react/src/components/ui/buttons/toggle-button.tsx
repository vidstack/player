import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { ToggleButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

const ToggleButtonBridge = createReactComponent(ToggleButtonInstance);

export interface ToggleButtonProps
  extends ReactElementProps<ToggleButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A toggle button is a two-state button that can be either off (not pressed) or on (pressed).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/toggle-button}
 * @example
 * ```tsx
 * <ToggleButton aria-label="...">
 *   <OnIcon />
 *   <OffIcon />
 * </ToggleButton>
 * ```
 */
const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <ToggleButtonBridge {...(props as Omit<ToggleButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </ToggleButtonBridge>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
export { ToggleButton };
