/**
 * Requests an animation frame and waits for it to be resolved.
 *
 * @param {import('../foundation/types').Callback<void>} [callback] - Invoked on the next animation frame.
 * @returns {Promise<number>}
 */
export function raf(callback?: import("../foundation/types").Callback<void> | undefined): Promise<number>;
/**
 * Builds an `exportsparts` attribute value given an array of `parts` and an optional `prefix`.
 *
 * @param {string[]} parts
 * @param {string} [prefix]
 * @returns {string}
 */
export function buildExportPartsAttr(parts: string[], prefix?: string | undefined): string;
/**
 * Registers a custom element in the CustomElementRegistry. By "safely" we mean:
 *
 * - Called only client-side (`window` is defined).
 * - The element is only registered if it hasn't been registered before under the given `name`.
 *
 * @param {string} name - A string representing the name you are giving the element.
 * @param {CustomElementConstructor} constructor - A class object that defines the behaviour of the element.
 * @param {boolean} isClient
 */
export function safelyDefineCustomElement(name: string, constructor: CustomElementConstructor, isClient?: boolean): void;
/**
 * Sets an attribute on the given `el`. If the `attrValue` is `undefined`or `null` the attribute
 * will be removed.
 *
 * @param {Element} element - The element to set the attribute on.
 * @param {string} attrName - The name of the attribute.
 * @param {string | boolean | undefined | null} [attrValue] - The value of the attribute.
 */
export function setAttribute(element: Element, attrName: string, attrValue?: string | boolean | undefined | null): void;
/**
 * Returns elements assigned to the given slot in the shadow root. Filters out all nodes
 * which are not of type `Node.ELEMENT_NODE`.
 *
 * @param {HTMLElement} el - The element containing the slot.
 * @param {string} [name] - The name of the slot (optional).
 * @returns {Element[]}
 */
export function getSlottedChildren(el: HTMLElement, name?: string | undefined): Element[];
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
export function willElementsCollide(a: Element, b: Element, translateAx?: number, translateAy?: number, translateBx?: number, translateBy?: number): boolean;
/**
 * @protected
 * @param {typeof import('lit').LitElement} elementCtor
 * @returns {Set<string>}
 */
export function getElementOwnAttributes(elementCtor: typeof import('lit').LitElement): Set<string>;
/**
 * @protected
 * @param {typeof import('lit').LitElement} elementCtor
 * @returns {Set<string>}
 */
export function getElementAttributes(elementCtor: typeof import('lit').LitElement): Set<string>;
/**
 * @param {Element} elementA
 * @param {Element} elementB
 * @param {Set<string>} attributes
 * @returns {MutationObserver}
 */
export function observeAndForwardAttributes(elementA: Element, elementB: Element, attributes: Set<string>): MutationObserver;
