import { useReactContext } from 'maverick.js/react';
import { useEffect, useState } from 'react';
import { mediaContext, type MediaPlayerElement } from 'vidstack';

/**
 * Returns the nearest parent media player element (i.e., `<media-player>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#media-player}
 */
export function useMediaPlayer(): MediaPlayerElement | null {
  const [player, setPlayer] = useState<MediaPlayerElement | null>(null),
    context = useReactContext(mediaContext);

  if (__DEV__ && !context) {
    throw Error(
      '[vidstack] no media context was found - was this called outside of `<MediaPlayer>`?',
    );
  }

  useEffect(() => {
    if (!context) return;
    setPlayer(context.player);
    return () => setPlayer(null);
  }, []);

  return player;
}
