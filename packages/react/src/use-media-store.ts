import { useReactContext } from 'maverick.js/react';
import type { RefObject } from 'react';
import { mediaContext, mediaStore, type MediaPlayerElement, type MediaStore } from 'vidstack';

import { useStore } from './use-store';

/**
 * This hook is used to subscribe to the current media state on the nearest parent
 * player element (i.e., `<media-player>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#reading}
 */
export function useMediaStore(ref?: RefObject<MediaPlayerElement | null>): Readonly<MediaStore> {
  const context = useReactContext(mediaContext);

  if (__DEV__ && !context && !ref) {
    console.warn(
      `[vidstack] \`useMediaStore\` requires \`RefObject<MediaPlayerElement>\` argument if called` +
        ' outside the <MediaPlayer> component',
    );
  }

  return useStore(mediaStore, ref, context?.$store);
}
