import { scoped } from 'maverick.js';
import { useReactContext, useReactScope } from 'maverick.js/react';
import { isUndefined } from 'maverick.js/std';
import { RefObject, useEffect, useMemo } from 'react';
import { mediaContext, MediaRemoteControl } from 'vidstack';

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * player.
 *
 * @param target - The DOM event target to dispatch request events from. Defaults to `<media-player>`
 * if no target is provided.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#updating}
 */
export function useMediaRemote(
  target?: EventTarget | null | RefObject<EventTarget | null>,
): MediaRemoteControl {
  const scope = useReactScope(),
    context = useReactContext(mediaContext);

  if (__DEV__ && isUndefined(target) && !context) {
    throw Error(
      '[vidstack] `useMediaRemote` requires `target` argument containing a ref to a DOM element' +
        ' if not called inside `<MediaPlayer>`.',
    );
  }

  const remote = useMemo(() => scoped(() => new MediaRemoteControl(), scope)!, []);

  useEffect(() => {
    const hasTarget = !isUndefined(target);

    if (hasTarget) {
      remote.setTarget(target && 'current' in target ? target.current : target);
    }

    if (context) {
      const player = context.$player();
      if (!hasTarget) remote.setTarget(player);
      remote.setPlayer(player);
    }

    return () => remote.setTarget(null);
  }, [target]);

  return remote;
}
