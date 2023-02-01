import { useReactContext } from 'maverick.js/react';
import type { RefObject } from 'react';
import { mediaContext, MediaPlayerElement, MediaStore, mediaStore } from 'vidstack';

import { useStore } from './use-store';

/**
 * This hook is used to subscribe to the current media state on the nearest parent
 * player element (i.e., `<media-player>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#reading}
 */
export function useMediaStore(ref?: RefObject<MediaPlayerElement | null>): Readonly<MediaStore> {
  const context = useReactContext(mediaContext);
  return useStore(
    mediaStore,
    (ref && 'current' in ref ? ref.current : ref)?.$store ?? context?.$store,
  );
}
