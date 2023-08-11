import * as React from 'react';
import { useReactContext } from 'maverick.js/react';
import { mediaContext, MediaRemoteControl } from 'vidstack/local';

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * player.
 *
 * @param target - The DOM event target to dispatch request events from. Defaults to player
 * if no target is provided.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state#updating}
 */
export function useMediaRemote(
  target?: EventTarget | null | React.RefObject<EventTarget | null>,
): MediaRemoteControl {
  const media = useReactContext(mediaContext)!;
  return React.useMemo<MediaRemoteControl>(() => {
    if (!target) return media.remote;
    const remote = new MediaRemoteControl(__DEV__ ? media.logger : void 0);
    remote.setPlayer(media.player);
    remote.setTarget(target && 'current' in target ? target.current : target);
    return remote;
  }, [media, target]);
}
