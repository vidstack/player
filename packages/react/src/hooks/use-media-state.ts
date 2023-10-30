import * as React from 'react';

import { useSignal, useSignalRecord, useStateContext } from 'maverick.js/react';
import { mediaState, type MediaState } from 'vidstack';

import { MediaPlayerInstance } from '../components/primitives/instances';

const mediaStateRecord = MediaPlayerInstance.state.record,
  initialMediaStore = Object.keys(mediaStateRecord).reduce(
    (store, prop) => ({
      ...store,
      [prop]() {
        return mediaStateRecord[prop];
      },
    }),
    {},
  );

/**
 * This hook is used to subscribe to a specific media state.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-media-state}
 */
export function useMediaState<T extends keyof MediaState>(
  prop: T,
  ref?: React.RefObject<MediaPlayerInstance | null>,
): MediaState[T] {
  const $state = useStateContext(mediaState);

  if (__DEV__ && !$state && !ref) {
    console.warn(
      `[vidstack] \`useMediaState\` requires \`RefObject<MediaPlayerInstance>\` argument if called` +
        ' outside the `<MediaPlayer>` component',
    );
  }

  return useSignal((ref?.current?.$state || $state || initialMediaStore)[prop]);
}

/**
 * This hook is used to subscribe to the current media state on the nearest parent player.
 *
 * @docs {@link https://vidstack.io/docs/player/core-concepts/state#reading}
 */
export function useMediaStore(
  ref?: React.RefObject<MediaPlayerInstance | null>,
): Readonly<MediaState> {
  const $state = useStateContext(mediaState);

  if (__DEV__ && !$state && !ref) {
    console.warn(
      `[vidstack] \`useMediaStore\` requires \`RefObject<MediaPlayerInstance>\` argument if called` +
        ' outside the `<MediaPlayer>` component',
    );
  }

  return useSignalRecord(ref?.current ? ref.current.$state : $state || initialMediaStore);
}
