import { effect, Observable, observable } from 'maverick.js';
import { useHost } from 'maverick.js/std';

import { connectedHostElement } from '../../utils/host';

export function useHostedIntersectionObserver(
  props?: Omit<UseIntersectionObserverProps, '$target'>,
): UseIntersectionObserver {
  const host = useHost();
  return useIntersectionObserver({
    $target: connectedHostElement(host),
    ...props,
  });
}

export function useIntersectionObserver(
  props: UseIntersectionObserverProps,
): UseIntersectionObserver {
  const $intersecting = observable(false),
    { $target, skipInitial, callback, ...observerInit } = props;

  let disconnect: (() => void) | undefined;

  effect(() => {
    const target = $target();

    if (!target) {
      $intersecting.set(false);
      return;
    }

    let first = true;

    const observer = new IntersectionObserver((entries) => {
      if (first && skipInitial) {
        first = false;
        return;
      }

      callback?.(entries, observer);
      $intersecting.set(entries[0].isIntersecting);
    }, observerInit);

    observer.observe(target);
    return (disconnect = () => {
      observer.disconnect();
      disconnect = undefined;
    });
  });

  return {
    get intersecting() {
      return $intersecting();
    },
    disconnect() {
      disconnect?.();
    },
  };
}

export type UseIntersectionObserver = {
  /**
   * Whether the current host element is intersecting with configured viewport.
   *
   * @observable
   */
  readonly intersecting: boolean;
  /**
   * Disconnect any active intersection observers.
   */
  disconnect(): void;
};

export type UseIntersectionObserverProps = {
  /**
   * The element to observe. No observer is created if a falsy value is set.
   */
  $target: Observable<Element | null>;
  /**
   * The element that is used as the viewport for checking visibility of the target. Must be the
   * ancestor of the target. Defaults to the browser viewport if not specified or if `null`.
   */
  root?: Element | Document | null;
  /**
   * Margin around the root. Can have values similar to the CSS margin property, e.g.
   * "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. This set
   * of values serves to grow or shrink each side of the root element's bounding box before
   * computing intersections. Defaults to all zeros.
   */
  rootMargin?: string;
  /**
   * Either a single number or an array of numbers which indicate at what percentage of the
   * target's visibility the observer's callback should be executed. If you only want to detect
   * when visibility passes the `50%` mark, you can use a value of `0.5`. If you want the callback
   * to run every time visibility passes another `25%`, you would specify the array
   * `[0, 0.25, 0.5, 0.75, 1]`.
   *
   * The default is `0` (meaning as soon as even one pixel is visible, the callback will be run).
   * A value of `1.0` means that the threshold isn't considered passed until every pixel is
   * visible.
   */
  threshold?: number | number[];
  /**
   * An IntersectionObserver reports the initial intersection state when observe is called.
   * Setting this flag to `true` skips processing this initial state for cases when this is
   * unnecessary.
   */
  skipInitial?: boolean;
  /**
   * Invoked when an intersection event occurs.
   */
  callback?: IntersectionObserverCallback;
};
