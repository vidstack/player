import {
  MEDIA_STORE_DEFAULTS,
  type MediaContext,
  type MediaElement,
  MediaRemoteControl,
} from '@vidstack/player';
import {
  createContext,
  type RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export const MediaElementContext = createContext<MediaElement | null>(null);

/**
 * Returns the nearest parent media element (i.e., `<vds-media>`).
 */
export function useMediaElement() {
  return useContext(MediaElementContext);
}

/**
 * This hook is used to access the current media state on the nearest parent media element (i.e.,
 * `<vds-media>`). Any properties you access here are subscribed to for live updates.
 *
 * @example
 * ```tsx
 * import { useMediaContext } from '@vidstack/player-react';
 *
 * function Component() {
 *  const { playing } = useMediaContext();
 *  return <div>{playing ? 'Media is paused.' : 'Media is playing.'}</div>
 * }
 * ```
 */
export function useMediaContext(
  media?: MediaElement | null | RefObject<MediaElement>,
): Readonly<MediaContext> {
  const [_, update] = useState(0);
  const subscriptions = useRef(new Map<keyof MediaContext, (() => void) | undefined>());

  const mediaElement = useMediaElement();
  const [currentMedia, setCurrentMedia] = useState<MediaElement | null>(null);

  useEffect(() => {
    setCurrentMedia((media && 'current' in media ? media.current : media) ?? mediaElement);
  }, [media, mediaElement]);

  function subscribe(prop: keyof MediaContext) {
    if (subscriptions.current.get(prop)) return;
    subscriptions.current.set(
      prop,
      currentMedia?.controller.store[prop].subscribe(() => {
        update((n) => n + 1);
      }),
    );
  }

  const proxy = useMemo(() => {
    const context = currentMedia?.controller.state ?? MEDIA_STORE_DEFAULTS;
    return new Proxy(context, {
      get(_, prop: keyof MediaContext) {
        subscribe(prop);
        return context[prop];
      },
    }) as unknown as MediaContext;
  }, [currentMedia]);

  useEffect(() => {
    for (const prop of subscriptions.current.keys()) {
      subscribe(prop as keyof MediaContext);
    }

    return () => {
      for (const prop of subscriptions.current.keys()) {
        subscriptions.current.get(prop)?.();
        subscriptions.current.set(prop, undefined);
      }
    };
  }, [currentMedia]);

  return proxy;
}

/**
 * A media remote provides a simple facade for dispatching media requests to the nearest media
 * controller.
 *
 * @param target - The DOM event target to dispatch request events from.
 *
 * @example
 * ```tsx
 * import { useMediaRemote } from '@vidstack/player-react';
 *
 * function PlayButton() {
 *   const remote = useMediaRemote();
 *   return <button onPointerUp={({ nativeEvent }) => remote.play(nativeEvent)}>Play</button>;
 * }
 * ```
 */
export function useMediaRemote(target?: EventTarget | null | RefObject<EventTarget>) {
  const mediaElement = useMediaElement();
  const remote = useRef(new MediaRemoteControl());

  const [currentTarget, setCurrentTarget] = useState<EventTarget | null>(null);

  useEffect(() => {
    setCurrentTarget((target && 'current' in target ? target.current : target) ?? mediaElement);
  }, [target, mediaElement]);

  useEffect(() => {
    remote.current.setTarget(currentTarget);
    return () => {
      remote.current.setTarget(null);
    };
  }, [currentTarget]);

  return remote.current;
}
