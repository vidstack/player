/**
 * @template T
 * @param {import("../types/misc").Constructor<T>} Element
 * @param {(keyof T)[]} internalProperties
 * @returns {import("lit-element").PropertyDeclarations}
 */
export const internalState = (Element, internalProperties) =>
	internalProperties.reduce(
		(props, prop) => ({
			...props,
			[prop]: { attribute: false }
		}),
		/** @type {import("lit-element").PropertyDeclarations} */ ({})
	);
