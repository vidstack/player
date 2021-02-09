import { listenTo } from '@wcom/events';
import { IS_CLIENT } from './support';

/**
 * Registers a custom element in the CustomElementRegistry. By "safely" we mean:
 *
 * - Called only client-side (`window` is defined).
 * - The element is only registered if it hasn't been registered before under the given `name`.
 *
 * @param name - A string representing the name you are giving the element.
 * @param constructor - A class object that defines the behaviour of the element.
 */
export const safelyDefineCustomElement = (
  name: string,
  constructor: CustomElementConstructor,
  isClient = IS_CLIENT,
) => {
  const isElementRegistered = isClient && window.customElements.get(name);
  if (!isClient || isElementRegistered) return;
  window.customElements.define(name, constructor);
};

/**
 * Determines whether two elements are interecting in the DOM.
 *
 * @param a - The first element.
 * @param b - The second element.
 * @param translateAx - Transpose element `a` along the x-axis by +/- pixels.
 * @param translateAy - Transpose element `a` along the y-axis by +/- pixels.
 * @param translateBx - Transpose element `b` along the x-axis by +/- pixels.
 * @param translateBx - Transpose element `b` along the y-axis by +/- pixels.
 */
export const isColliding = (
  a: HTMLElement,
  b: HTMLElement,
  translateAx = 0,
  translateAy = 0,
  translateBx = 0,
  translateBy = 0,
) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (
    aRect.left + translateAx < bRect.right + translateBx &&
    aRect.right + translateAx > bRect.left + translateBx &&
    aRect.top + translateAy < bRect.bottom + translateBy &&
    aRect.bottom + translateAy > bRect.top + translateBy
  );
};

/**
 * Listens for input device changes (mouse/touch) and invokes a callback whether the current
 * device is touch-based.
 *
 * @param callback - Called when the input device is changed.
 */
export const onInputDeviceChange = (
  callback: (isTouch: boolean) => void,
  isClient = IS_CLIENT,
) => {
  if (!isClient) return () => {};

  let lastTouchTime = 0;

  const offTouchListener = listenTo(
    window,
    'touchstart',
    () => {
      lastTouchTime = new Date().getTime();
      callback(true);
    },
    true,
  );

  const offMouseListener = listenTo(
    window,
    'mousemove',
    () => {
      // Filter emulated events coming from touch events
      if (new Date().getTime() - lastTouchTime < 500) return;
      callback(false);
    },
    true,
  );

  return () => {
    offTouchListener();
    offMouseListener();
  };
};
