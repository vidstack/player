import { effect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import { RefObject, useEffect, useState } from 'react';
import { MediaElement, mediaStore, MediaStore, MediaStoreContext } from 'vidstack';

/**
 * This hook is used to access the current media state on the nearest parent media element (i.e.,
 * `<vds-media>`).
 *
 * @example
 * ```tsx
 * import { useMediaState } from '@vidstack/react';
 *
 * function Component() {
 *  const isPlaying = useMediaState('playing');
 *  return <div>{isPlaying ? 'Media is _not_ playing.' : 'Media is playing.'}</div>
 * }
 * ```
 */
export function useMediaState<T extends keyof MediaStore>(
  prop: T,
  target?: MediaElement | null | RefObject<MediaElement>,
): MediaStore[T] {
  const [state, setState] = useState<MediaStore[T]>(mediaStore.initial[prop]),
    $store = useReactContext(MediaStoreContext);

  if (__DEV__ && !target && !$store) {
    console.warn(
      '[vidstack] `useMediaState` requires second argument containing a ref to `<vds-media>`' +
        ' element if _not_ called inside a child component of `<Media>`. This hook will _not_ be' +
        ' updated when media state changes until this is resolved.',
    );
  }

  useEffect(() => {
    const media = target && 'current' in target ? target.current : target;
    const store = media?.$store ?? $store;
    if (store) return effect(() => void setState(store[prop]));
  }, [prop, target, $store]);

  return state;
}
