import { useReactContext } from 'maverick.js/react';
import { isUndefined } from 'maverick.js/std';
import { RefObject, useEffect, useRef } from 'react';
import { mediaContext, MediaRemoteControl } from 'vidstack';

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * controller.
 *
 * @param target - The DOM event target to dispatch request events from. Defaults to `<vds-media>`
 * if no target is provided.
 *
 * @docs {@link https://vidstack.io/docs/react/player/core-concepts/state-management#updating}
 */
export function useMediaRemote(
  target?: EventTarget | null | RefObject<EventTarget | null>,
): MediaRemoteControl {
  const remote = useRef(new MediaRemoteControl()),
    context = useReactContext(mediaContext);

  if (__DEV__ && isUndefined(target) && !context) {
    throw Error(
      '[vidstack] `useMediaRemote` requires `target` argument containing a ref to a DOM element' +
        ' if no media context is provided - did you forget to provide it?`.',
    );
  }

  useEffect(() => {
    if (!isUndefined(target)) {
      remote.current.setTarget(target && 'current' in target ? target.current : target);
    } else if (context) {
      remote.current.setTarget(context.$element());
    }

    return () => remote.current.setTarget(null);
  }, [target]);

  return remote.current;
}
