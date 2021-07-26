import { isFunction, isNil, isString } from './unit.js';

/**
 * Requests an animation frame and waits for it to be resolved.
 *
 * @param {() => void} [callback] - Invoked on the next animation frame.
 * @returns {Promise<number>}
 */
export function raf(callback) {
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
 * @param {string[]} parts
 * @param {string | ((part: string) => string)} [prefix]
 * @returns {string}
 */
export function buildExportPartsAttr(parts, prefix) {
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
 * Sets an attribute on the given `el`. If the `attrValue` is `undefined`or `null` the attribute
 * will be removed.
 *
 * @param {Element} element - The element to set the attribute on.
 * @param {string} attrName - The name of the attribute.
 * @param {string | boolean | undefined | null} [attrValue] - The value of the attribute.
 */
export function setAttribute(element, attrName, attrValue) {
  if (isNil(attrValue) || attrValue === false) {
    element.removeAttribute(attrName);
  } else {
    element.setAttribute(attrName, isString(attrValue) ? attrValue : '');
  }
}

/**
 * Returns elements assigned to the given slot in the shadow root. Filters out all nodes
 * which are not of type `Node.ELEMENT_NODE`.
 *
 * @param {HTMLElement} el - The element containing the slot.
 * @param {string} [name] - The name of the slot (optional).
 * @returns {Element[]}
 */
export function getSlottedChildren(el, name) {
  const selector = name ? `slot[name="${name}"]` : 'slot:not([name])';

  const slot = /** @type {HTMLSlotElement | null} */ (
    el.shadowRoot?.querySelector(selector)
  );

  const childNodes = slot?.assignedNodes({ flatten: true }) ?? [];

  return Array.prototype.filter.call(
    childNodes,
    (node) => node.nodeType == Node.ELEMENT_NODE
  );
}

/**
 * Determines whether two elements are interecting in the DOM.
 *
 * @param {Element} a - The first element.
 * @param {Element} b - The second element.
 * @param {number} translateAx - Transpose element `a` along the x-axis by +/- pixels.
 * @param {number} translateAy - Transpose element `a` along the y-axis by +/- pixels.
 * @param {number} translateBx - Transpose element `b` along the x-axis by +/- pixels.
 * @param {number} translateBy - Transpose element `b` along the y-axis by +/- pixels.
 * @returns {boolean}
 */
export function willElementsCollide(
  a,
  b,
  translateAx = 0,
  translateAy = 0,
  translateBx = 0,
  translateBy = 0
) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (
    aRect.left + translateAx < bRect.right + translateBx &&
    aRect.right + translateAx > bRect.left + translateBx &&
    aRect.top + translateAy < bRect.bottom + translateBy &&
    aRect.bottom + translateAy > bRect.top + translateBy
  );
}

/**
 * @param {typeof import('lit').LitElement} elementCtor
 * @returns {Set<string>}
 */
export function getElementAttributes(elementCtor) {
  return new Set(elementCtor.observedAttributes);
}

/**
 * @param {Element} elementA
 * @param {Element} elementB
 * @param {Set<string>} attributes
 * @returns {MutationObserver}
 */
export function observeAndForwardAttributes(elementA, elementB, attributes) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const attrName = /** @type {string} **/ (mutation.attributeName);
        const attrValue = /** @type {string} */ (
          elementA.getAttribute(attrName)
        );

        setAttribute(elementB, attrName, attrValue);
      }
    }
  });

  observer.observe(elementA, {
    attributeFilter: Array.from(attributes)
  });

  return observer;
}
