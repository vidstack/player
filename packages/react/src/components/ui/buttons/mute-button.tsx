import * as React from 'react';

import { composeRefs, createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { MuteButtonInstance } from '../../primitives/instances';
import { Primitive } from '../../primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * MuteButton
 * -----------------------------------------------------------------------------------------------*/

const MuteButtonBridge = createReactComponent(MuteButtonInstance, {
  domEventsRegex: /^onMedia/,
});

export interface MuteButtonProps extends ReactElementProps<MuteButtonInstance, HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button for toggling the muted state of the player.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/mute-button}
 * @example
 * ```tsx
 * const volume = useMediaState('volume'),
 *   isMuted = useMediaState('muted');
 *
 * <MuteButton>
 *   {isMuted || volume == 0 ? (
 *     <MuteIcon />
 *   ) : volume < 0.5 ? (
 *     <VolumeLowIcon />
 *   ) : (
 *     <VolumeHighIcon />
 *   )}
 * </MuteButton>
 * ```
 */
const MuteButton = React.forwardRef<HTMLButtonElement, MuteButtonProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <MuteButtonBridge {...(props as Omit<MuteButtonProps, 'ref'>)}>
        {(props) => (
          <Primitive.button
            {...props}
            ref={composeRefs(props.ref as React.Ref<any>, forwardRef as React.Ref<any>)}
          >
            {children}
          </Primitive.button>
        )}
      </MuteButtonBridge>
    );
  },
);

MuteButton.displayName = 'MuteButton';
export { MuteButton };
