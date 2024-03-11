import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';
import type { MediaSrc } from 'vidstack';

import type { PlayerSrc } from '../source';
import { playerCallbacks } from './player-callbacks';
import { MediaPlayerInstance } from './primitives/instances';
import { Primitive } from './primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * MediaPlayer
 * -----------------------------------------------------------------------------------------------*/

const MediaPlayerBridge = createReactComponent(MediaPlayerInstance, {
  events: playerCallbacks,
  eventsRegex: /^onHls/,
  domEventsRegex: /^onMedia/,
});

export interface MediaPlayerProps extends Omit<ReactElementProps<MediaPlayerInstance>, 'src'> {
  /**
   * The URL or object of the current media resource/s to be considered for playback.
   *
   * @see {@link https://vidstack.io/docs/player/core-concepts/loading#loading-source}
   */
  src?: PlayerSrc;
  aspectRatio?: string;
  asChild?: boolean;
  children: React.ReactNode;
  ref?: React.Ref<MediaPlayerInstance>;
}

/**
 * All media components exist inside the `<MediaPlayer>` component. This component's main
 * responsibilities are to manage media state updates, dispatch media events, handle media
 * requests, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/media/player}
 * @example
 * ```tsx
 * <MediaPlayer src="...">
 *   <MediaProvider />
 * </MediaPlayer>
 * ```
 */
const MediaPlayer = React.forwardRef<MediaPlayerInstance, MediaPlayerProps>(
  ({ aspectRatio, children, ...props }, forwardRef) => {
    return (
      <MediaPlayerBridge
        {...props}
        src={props.src as MediaSrc}
        ref={forwardRef}
        style={{
          aspectRatio,
          ...props.style,
        }}
      >
        {(props) => <Primitive.div {...props}>{children}</Primitive.div>}
      </MediaPlayerBridge>
    );
  },
);

MediaPlayer.displayName = 'MediaPlayer';
export { MediaPlayer };
