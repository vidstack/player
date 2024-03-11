import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { LiveButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * LiveButton
 * -----------------------------------------------------------------------------------------------*/

const LiveButtonBridge = createReactComponent(LiveButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface LiveButtonProps extends ReactElementProps<LiveButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * This component displays the current live status of the stream. This includes whether it's
 * live, at the live edge, or not live. In addition, this component is a button during live streams
 * and will skip ahead to the live edge when pressed.
 *
 * 🚨 This component will have `aria-hidden="true"` applied when the current stream is _not_
 * live.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/live-button}
 * @example
 * ```tsx
 * <LiveButton>
 *   <LiveIcon />
 * </LiveButton>
 * ```
 */
const LiveButton = React.forwardRef<HTMLButtonElement, LiveButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <LiveButtonBridge {...(props as Omit<LiveButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </LiveButtonBridge>
    );
  },
);

LiveButton.displayName = 'LiveButton';
export { LiveButton };
