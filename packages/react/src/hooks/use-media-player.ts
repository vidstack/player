import { useReactContext } from 'maverick.js/react';
import { mediaContext } from 'vidstack/local';
import type { MediaPlayerInstance } from '../components/primitives/instances';

/**
 * Returns the nearest parent player component.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state#media-player}
 */
export function useMediaPlayer(): MediaPlayerInstance | null {
  const context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error(
      '[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?',
    );
  }

  return context?.player || null;
}
