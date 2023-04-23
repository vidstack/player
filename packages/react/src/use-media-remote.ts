import { useReactContext } from 'maverick.js/react';
import { isUndefined } from 'maverick.js/std';
import { useEffect, useMemo, type RefObject } from 'react';
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
  const context = useReactContext(mediaContext),
    remote = useMemo(() => new MediaRemoteControl(), []);

  useEffect(() => {
    const player = context && context.player;

    const ref = !isUndefined(target)
      ? target && 'current' in target
        ? target.current
        : target
      : player;

    remote.setTarget(ref || null);
    remote.setPlayer(player || null);
  }, [target]);

  return remote;
}
