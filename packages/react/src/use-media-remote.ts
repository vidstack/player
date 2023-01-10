import { effect } from 'maverick.js';
import { useReactContext } from 'maverick.js/react';
import { RefObject, useEffect, useRef } from 'react';
import { MediaElementContext, MediaRemoteControl } from 'vidstack';

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * controller.
 *
 * @param target - The DOM event target to dispatch request events from.
 *
 * @example
 * ```tsx
 * import { useMediaRemote } from '@vidstack/react';
 *
 * function PlayButton() {
 *   const remote = useMediaRemote();
 *   return <button onPointerUp={({ nativeEvent }) => remote.play(nativeEvent)}>Play</button>;
 * }
 * ```
 */
export function useMediaRemote(
  target?: EventTarget | null | RefObject<EventTarget>,
): MediaRemoteControl {
  const remote = useRef(new MediaRemoteControl()),
    $mediaElement = useReactContext(MediaElementContext);

  if (__DEV__ && !target && !$mediaElement) {
    console.warn(
      '[vidstack] `useMediaRemote` requires second argument containing a ref to a DOM element' +
        ' if _not_ called inside a child component of `<Media>`.',
    );
  }

  useEffect(() => {
    const remoteTarget = target || $mediaElement?.();
    if (remoteTarget) {
      remote.current.setTarget('current' in remoteTarget ? remoteTarget.current : remoteTarget);
    } else if ($mediaElement) {
      return effect(() => void remote.current.setTarget($mediaElement()));
    }
  }, [target]);

  return remote.current;
}
