import { useReactContext } from 'maverick.js/react';
import { mediaContext } from 'vidstack';

import type { MediaPlayerInstance } from '../components/primitives/instances';

/**
 * Returns the nearest parent player component.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-media-player}
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
