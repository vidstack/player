import * as React from 'react';

import { createReactComponent, type ReactElementProps } from 'maverick.js/react';

import { MediaPlayerInstance } from './primitives/instances';
import { Primitive } from './primitives/nodes';

/* -------------------------------------------------------------------------------------------------
 * MediaPlayer
 * -----------------------------------------------------------------------------------------------*/

const MediaPlayerBridge = createReactComponent(MediaPlayerInstance, {
  events: [
    'onAbort',
    'onControlsChange',
    'onDurationChange',
    'onEmptied',
    'onError',
    'onFindMediaPlayer',
    'onOrientationChange',
    'onPause',
    'onPlaysinlineChange',
    'onPosterChange',
    'onProgress',
    'onReplay',
    'onStarted',
    'onSuspend',
    'onStalled',
    'onWaiting',
  ],
  eventsRegex:
    /^on(Can|Auto|Source|User|Fullscreen|End|Load|Play|Provider|Picture|Hls|Media|Live|Loop|Audio|Video|Time|TextTrack|Volume|Quality?|Rate|Seek|Stream|Destroy|Vds)/,
});

export interface MediaPlayerProps extends ReactElementProps<MediaPlayerInstance> {
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
