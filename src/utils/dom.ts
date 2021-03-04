import { IS_CLIENT } from './support';
import { isUndefined } from './unit';

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
 * Sets an attribute on the given `el`. If the `attrValue` is `undefined` the attribute will
 * be removed.
 *
 * @param el - The element to set the attribute on.
 * @param attrName - The name of the attribute.
 * @param attrValue - The value of the attribute.
 */
export function setAttribute(
  el: HTMLElement,
  attrName: string,
  attrValue?: string,
): void {
  if (isUndefined(attrValue)) {
    el.removeAttribute(attrName);
  } else {
    el.setAttribute(attrName, attrValue);
  }
}

/**
 * Returns elements assigned to the default slot in the shadow root. Filters out all nodes
 * which are not of type `Node.ELEMENT_NODE`.
 *
 * @param el - The element containing the slot.
 * @param name - The name of the slot (optional).
 */
export function getSlottedChildren(el: HTMLElement, name?: string): Element[] {
  const selector = name ? `slot[name="${name}"]` : 'slot';
  const slot = el.shadowRoot?.querySelector(selector) as HTMLSlotElement | null;
  const childNodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return Array.prototype.filter.call(
    childNodes,
    node => node.nodeType == Node.ELEMENT_NODE,
  );
}

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
): boolean => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (
    aRect.left + translateAx < bRect.right + translateBx &&
    aRect.right + translateAx > bRect.left + translateBx &&
    aRect.top + translateAy < bRect.bottom + translateBy &&
    aRect.bottom + translateAy > bRect.top + translateBy
  );
};
