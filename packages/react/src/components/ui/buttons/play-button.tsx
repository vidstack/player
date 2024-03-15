import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { PlayButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * PlayButton
 * -----------------------------------------------------------------------------------------------*/

const PlayButtonBridge = createReactComponent(PlayButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface PlayButtonProps extends ReactElementProps<PlayButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the playback state (play/pause) of the current media.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/play-button}
 * @example
 * ```tsx
 * const isPaused = useMediaState('paused');
 *
 * <PlayButton>
 *   {isPaused ? <PlayIcon /> : <PauseIcon />}
 * </PlayButton>
 * ```
 */
const PlayButton = React.forwardRef<HTMLButtonElement, PlayButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <PlayButtonBridge {...(props as Omit<PlayButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </PlayButtonBridge>
    );
  },
);

PlayButton.displayName = 'PlayButton';
export { PlayButton };
