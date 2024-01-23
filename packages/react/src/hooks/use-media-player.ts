import type { MediaPlayerInstance } from '../components/primitives/instances';
import { useMediaContext } from './use-media-context';

/**
 * Returns the nearest parent player component.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-media-player}
 */
export function useMediaPlayer(): MediaPlayerInstance | null {
  const context = useMediaContext();

  if (__DEV__ && !context) {
    throw Error(
      '[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?',
    );
  }

  return context?.player || null;
}
