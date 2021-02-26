import { listenTo } from '@wcom/events';
import { Unsubscribe } from '../shared/types';
import { IS_CLIENT, IS_MOBILE } from './support';
import { noop, isUndefined } from './unit';

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
): void => {
  const isElementRegistered = isClient && window.customElements.get(name);
  if (!isClient || isElementRegistered) return;
  window.customElements.define(name, constructor);
};

/**
 * Returns elements assigned to the default slot in the shadow root. Filters out all nodes
 * which are not of type `Node.ELEMENT_NODE`.
 *
 * @param el - The element containing the slot.
 */
export function getSlottedChildren(el: HTMLElement): Element[] {
  const slot = el.shadowRoot?.querySelector('slot');
  const childNodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return Array.prototype.filter.call(
    childNodes,
    node => node.nodeType == Node.ELEMENT_NODE,
  );
}

export enum Device {
  Mobile = 'mobile',
  Desktop = 'desktop',
}

/**
 * Listens for device changes (mobile/desktop) and invokes a callback whether the current
 * view is mobile. It determines the type by either listening for `resize` events
 * on the window (if API is available), otherwise it'll fallback to parsing the user agent string.
 *
 * @param callback - Called when the device changes.
 * @param maxWidth - The maximum window width in pixels to consider device as mobile.
 */
export const onDeviceChange = (
  callback: (device: Device) => void,
  maxWidth = 480,
  isClient = IS_CLIENT,
  isMobile = IS_MOBILE,
): Unsubscribe => {
  const isServerSide = !isClient;
  const isResizeObsDefined = !isUndefined(window.ResizeObserver);

  if (isServerSide || !isResizeObsDefined) {
    callback(isMobile ? Device.Mobile : Device.Desktop);
    return noop;
  }

  function handleWindowResize() {
    const isMobileScreen = window.innerWidth <= maxWidth;
    callback(isMobileScreen || isMobile ? Device.Mobile : Device.Desktop);
  }

  handleWindowResize();
  return listenTo(window, 'resize', handleWindowResize);
};
