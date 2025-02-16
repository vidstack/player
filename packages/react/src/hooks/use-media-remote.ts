import * as React from 'react';

import { MediaRemoteControl } from 'vidstack';

import { MediaPlayerInstance } from '../components/primitives/instances';
import { useMediaContext } from './use-media-context';

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * player.
 *
 * @param target - The DOM event target to dispatch request events from. Defaults to player
 * if no target is provided.
 *
 * @docs {@link https://www.vidstack.io/docs/player/api/hooks/use-media-remote}
 */
export function useMediaRemote(
  target?: EventTarget | null | React.RefObject<EventTarget | null>,
): MediaRemoteControl {
  const media = useMediaContext(),
    remote = React.useRef<MediaRemoteControl>(null!);

  if (!remote.current) {
    remote.current = new MediaRemoteControl();
  }

  React.useEffect(() => {
    const ref = target && 'current' in target ? target.current : target,
      isPlayerRef = ref instanceof MediaPlayerInstance,
      player = isPlayerRef ? ref : media?.player;

    remote.current!.setPlayer(player ?? null);
    remote.current!.setTarget(ref ?? null);
  }, [media, target && 'current' in target ? target.current : target]);

  return remote.current;
}
