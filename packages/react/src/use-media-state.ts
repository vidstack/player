import { effect, signal, StopEffect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import { noop } from 'maverick.js/std';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { MediaElement, MediaState, mediaStore, MediaStoreContext } from 'vidstack';

/**
 * This hook is used to access the current media state on the nearest parent media element (i.e.,
 * `<vds-media>`).
 *
 * @example
 * ```tsx
 * import { useMediaState } from '@vidstack/react';
 *
 * function Component() {
 *  const { playing } = useMediaState();
 *  return <div>{playing ? 'Media is _not_ playing.' : 'Media is playing.'}</div>
 * }
 * ```
 */
export function useMediaState(
  target?: MediaElement | null | RefObject<MediaElement>,
): Readonly<MediaState> {
  const [_, update] = useState(0),
    stop = useRef<StopEffect | null>(null),
    $store = useReactContext(MediaStoreContext);

  if (__DEV__ && !target && !$store) {
    console.warn(
      '[vidstack] `useMediaState` requires second argument containing a ref to `<vds-media>`' +
        ' element if _not_ called inside a child component of `<Media>`. This hook will _not_ be' +
        ' updated when media state changes until this is resolved.',
    );
  }

  useEffect(() => () => stop.current?.(), []);

  return useMemo(() => {
    const media = target && 'current' in target ? target.current : target,
      state = media?.state ?? $store ?? mediaStore.initial,
      $props = signal<(keyof MediaState)[]>([]);

    stop.current?.();
    stop.current = effect(() => {
      const props = $props;
      for (let i = 0; i < props.length; i++) state[props[i]];
      update((n) => n + 1);
    });

    return new Proxy(state, {
      get(_, prop: keyof MediaState) {
        $props.set((prev) => [...prev, prop]);
        return state[prop];
      },
      // @ts-expect-error
      set: noop,
    });
  }, [target]);
}
