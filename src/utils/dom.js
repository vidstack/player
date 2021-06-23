import { LitElement, ReactiveElement } from 'lit';

import {
	DisposalBin,
	listen,
	redispatchNativeEvent
} from '../shared/events/index.js';
import { IS_CLIENT } from './support.js';
import { isUndefined } from './unit.js';

/**
 * Requests an animation frame and waits for it to be resolved.
 *
 * @param {import('../shared/types/utils').Callback<void>} [callback] - Invoked on the next animation frame.
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
 * @param {string} [prefix]
 * @returns {string}
 */
export function buildExportPartsAttr(parts, prefix) {
	return parts
		.map((part) => `${part}: ${prefix ? `${prefix}-` : ''}${part}`)
		.join(', ');
}

/**
 * Registers a custom element in the CustomElementRegistry. By "safely" we mean:
 *
 * - Called only client-side (`window` is defined).
 * - The element is only registered if it hasn't been registered before under the given `name`.
 *
 * @param {string} name - A string representing the name you are giving the element.
 * @param {CustomElementConstructor} constructor - A class object that defines the behaviour of the element.
 * @param {boolean} isClient
 * @returns {void}
 */
export const safelyDefineCustomElement = (
	name,
	constructor,
	isClient = IS_CLIENT
) => {
	const isElementRegistered =
		isClient && !isUndefined(window.customElements.get(name));
	if (!isClient || isElementRegistered) return;
	window.customElements.define(name, constructor);
};

/**
 * Sets an attribute on the given `el`. If the `attrValue` is `undefined` the attribute will
 * be removed.
 *
 * @param {HTMLElement} el - The element to set the attribute on.
 * @param {string} attrName - The name of the attribute.
 * @param {string} [attrValue] - The value of the attribute.
 * @returns {void}
 */
export function setAttribute(el, attrName, attrValue) {
	if (isUndefined(attrValue)) {
		el.removeAttribute(attrName);
	} else {
		el.setAttribute(attrName, attrValue);
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
 * @param {number} translateBx - Transpose element `b` along the y-axis by +/- pixels.
 * @returns {boolean}
 */
export const willElementsCollide = (
	a,
	b,
	translateAx = 0,
	translateAy = 0,
	translateBx = 0,
	translateBy = 0
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
 * Proxy unknown operations on `objA` to `objB`.
 *
 * @param {object} objA
 * @param {object} objB
 * @returns {(() => void)} Cleanup function.
 */
export function proxyUnknownOperations(objA, objB) {
	const proto = Object.getPrototypeOf(objA);
	const newProto = Object.create(proto);

	Object.setPrototypeOf(
		objA,
		new Proxy(newProto, {
			get(target, prop) {
				if (!(prop in objA) && prop in objB) {
					return Reflect.get(objB, prop, objB);
				}

				return Reflect.get(target, prop, objA);
			},
			set(target, prop, value) {
				if (!(prop in objA) && prop in objB) {
					return Reflect.set(objB, prop, value, objB);
				}

				return Reflect.set(target, prop, value, objA);
			}
		})
	);

	return () => {
		Object.setPrototypeOf(objA, proto);
	};
}

/**
 * Creates a bridge from `elementA` to `elementB`.
 *
 * @param {HTMLElement} elementA
 * @param {HTMLElement} elementB
 * @returns {(() => void)} Cleanup function.
 */
export function bridgeElements(elementA, elementB) {
	const disposal = new DisposalBin();

	/** @type {Set<string>} */
	const attributeNames = new Set();

	/** @type {Set<string>} */
	const eventTypes = new Set();

	// Proxy unknown operations on `elementA` to `elementB`.
	const disposeProxy = proxyUnknownOperations(elementA, elementB);
	disposal.add(disposeProxy);

	// Walk proto chain and collect attributes + events.
	let ctor = elementB.constructor;
	while (ctor) {
		const props = /** @type {any} */ (ctor).properties ?? {};
		Object.keys(props)
			.map((prop) => props[prop].attribute ?? prop.toLowerCase())
			.forEach((attr) => {
				attributeNames.add(attr);
			});

		const events = /** @type {any} */ (ctor).events ?? [];
		events.forEach((eventType) => {
			eventTypes.add(eventType);
		});

		ctor = Object.getPrototypeOf(ctor);
	}

	// Forward initial attributes on `elementA` to `elementB` attributes.
	attributeNames.forEach((attrName) => {
		if (elementA.hasAttribute(attrName)) {
			const attrValue = /** @type {string} */ (elementA.getAttribute(attrName));
			elementB.setAttribute(attrName, attrValue);
		}
	});

	// Observe attribute changes and forward to `elementB`.
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'attributes') {
				const attrName = /** @type {string} **/ (mutation.attributeName);
				const attrValue = /** @type {string} */ (
					elementA.getAttribute(attrName)
				);
				elementB.setAttribute(attrName, attrValue);
			}
		}
	});

	observer.observe(elementA, { attributeFilter: Array.from(attributeNames) });
	disposal.add(() => observer.disconnect());

	// Listen to dispatched events on `elementB` and forward them.
	Array.from(eventTypes)
		.map((eventType) =>
			listen(elementB, eventType, (e) => {
				redispatchNativeEvent(elementA, e);
			})
		)
		.forEach((dispose) => {
			disposal.add(dispose);
		});

	return () => {
		disposal.empty();
	};
}
