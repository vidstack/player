/**
 * @mixin
 * @template {import('../../foundation/types').Constructor<import('lit').ReactiveElement>} T
 * @param {T} Base - The constructor to mix into.
 * @returns {T & import('../../foundation/types').Constructor<import('./types').MediaProviderBridge>}
 */
export function WithMediaProviderBridge<T extends import("../../foundation/types").Constructor<import("lit").ReactiveElement>>(Base: T): T & import("../../foundation/types").Constructor<import("./types").MediaProviderBridge>;
/**
 * @readonly
 * @type {(keyof import('./types').MediaProviderBridgedProperties | keyof import('./types').MediaProviderBridgedMethods)[]}
 */
export const BRIDGED_MEDIA_PROVIDER_PROPERTIES: (keyof import('./types').MediaProviderBridgedProperties | keyof import('./types').MediaProviderBridgedMethods)[];
