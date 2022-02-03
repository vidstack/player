import { LitElement } from 'lit';

import { IS_CLIENT } from './support';
import { isFunction, isNil, isString, isUndefined } from './unit';

/**
 * Requests an animation frame and waits for it to be resolved.
 *
 * @param callback - Invoked on the next animation frame.
 */
export function raf(callback?: () => void): Promise<number> {
  return new Promise((resolve) => {
    const rafId = window.requestAnimationFrame(async () => {
      await callback?.();
      resolve(rafId);
    });
  });
}

/**
 * Builds an `exportsparts` attribute value given an array of `parts` and an optional `prefix`.
 *
 * @param parts
 * @param prefix
 */
export function buildExportPartsAttr(
  parts: string[],
  prefix: string | ((part: string) => string)
): string {
  return parts
    .map(
      (part) =>
        `${part}: ${
          !isFunction(prefix) ? (prefix ? `${prefix}-` : '') : prefix(part)
        }${part}`
    )
    .join(', ');
}

/**
 * Registers a custom element in the CustomElementRegistry. By "safely" we mean:
 *
 * - Called only client-side (`window` is defined).
 * - The element is only registered if it hasn't been registered before under the given `name`.
 *
 * @param name - A string representing the name you are giving the element.
 * @param constructor - A class object that defines the behavior of the element.
 * @param isClient
 */
export function safelyDefineCustomElement(
  name: string,
  constructor: CustomElementConstructor,
  isClient = IS_CLIENT
) {
  const isElementRegistered =
    isClient && !isUndefined(window.customElements.get(name));
  if (!isClient || isElementRegistered) return;
  window.customElements.define(name, constructor);
}

/**
 * Sets an attribute on the given `element`. If the `attrValue` is `undefined`or `null` the
 * attribute will be removed.
 *
 * @param element - The element to set the attribute on.
 * @param attrName - The name of the attribute.
 * @param attrValue - The value of the attribute.
 */
export function setAttribute(
  element: Element,
  attrName: string,
  attrValue?: string | boolean | undefined | null
) {
  if (isNil(attrValue) || attrValue === false) {
    element.removeAttribute(attrName);
  } else {
    const value = isString(attrValue) ? attrValue : '';
    element.setAttribute(attrName, value);
  }
}

/**
 * Sets an attribute on the given `element` if it does not have the attribute set.
 *
 * @param element - The element to set the attribute on.
 * @param attrName - The name of the attribute.
 * @param attrValue - The value of the attribute.
 */
export function setAttributeIfEmpty(
  element: Element,
  attrName: string,
  attrValue: string
) {
  if (!element.hasAttribute(attrName)) {
    element.setAttribute(attrName, attrValue);
  }
}

/**
 * Returns elements assigned to the given slot in the shadow root. Filters out all nodes
 * which are not of type `Node.ELEMENT_NODE`.
 *
 * @param el - The element containing the slot.
 * @param name - The name of the slot (optional).
 */
export function getSlottedChildren(el: HTMLElement, name?: string): Element[] {
  const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';

  const slot = el.shadowRoot?.querySelector(selector) as HTMLSlotElement | null;

  const childNodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return Array.prototype.filter.call(
    childNodes,
    (node) => node.nodeType == Node.ELEMENT_NODE
  );
}

export function getElementAttributes(
  elementCtor: typeof LitElement
): Set<string> {
  return new Set(elementCtor.observedAttributes);
}

export function observeAttributes(
  element: Element,
  attributes: Set<string>,
  onChange: (attrName: string, attrValue: string | null) => void
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const attrName = mutation.attributeName as string;
        const attrValue = element.getAttribute(attrName);
        onChange?.(attrName, attrValue);
      }
    }
  });

  observer.observe(element, {
    attributeFilter: Array.from(attributes)
  });

  return observer;
}
