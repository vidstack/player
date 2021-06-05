import { isUndefined } from '../../utils/unit';

/**
 * @param {import("../../types/context").Context<any>} context
 * @return {PropertyDecorator}
 */
export function consumeContext(context) {
	/**
	 * Legacy Decorator
	 *
	 * @param {any} proto
	 * @param {string} name
	 * @link https://www.typescriptlang.org/docs/handbook/decorators.html
	 */
	function legacy(proto, name) {
		/** @type {import('../../types/context').ContextInitializer} */
		const ctor = proto.constructor;

		if (isUndefined(ctor.defineContextConsumer)) {
			throw Error(
				`[${ctor.name}] requires the [WithContext] mixin to use the [@consumeContext] decorator.`
			);
		}

		ctor.defineContextConsumer(context, name);
	}

	/**
	 * TC39 Decorator
	 *
	 * @param {any} context
	 * @link https://github.com/tc39/proposal-decorators
	 */
	function standard(context) {
		// TODO: implement when spec formalized.
		throw Error('[@consumeContext] TC39 decorators are not supported yet.');
	}

	/**
	 * @param {any} protoOrContext
	 * @param {(string|undefined)} [propertyKey]
	 */
	function decorator(protoOrContext, propertyKey) {
		const hasPropertyKey = propertyKey !== undefined;
		return hasPropertyKey
			? legacy(protoOrContext, propertyKey)
			: standard(protoOrContext);
	}

	return decorator;
}

/**
 * @param {import("../../types/context").Context<any>} context
 * @return {PropertyDecorator}
 */
export function provideContext(context) {
	/**
	 * Legacy Decorator
	 *
	 * @param {any} proto
	 * @param {string} name
	 * @link https://www.typescriptlang.org/docs/handbook/decorators.html
	 */
	function legacy(proto, name) {
		/** @type {import('../../types/context').ContextInitializer} */
		const ctor = proto.constructor;

		if (isUndefined(ctor.defineContextProvider)) {
			throw Error(
				`[${ctor.name}] requires the [WithContext] mixin to use the [@provideContext] decorator.`
			);
		}

		ctor.defineContextProvider(context, name);
	}

	/**
	 * TC39 Decorator
	 *
	 * @param {any} context
	 * @link https://github.com/tc39/proposal-decorators
	 */
	function standard(context) {
		// TODO: implement when spec formalized.
		throw Error('[@provideContext] TC39 decorators are not supported yet.');
	}

	/**
	 * @param {any} protoOrContext
	 * @param {(string|undefined)} [propertyKey]
	 */
	function decorator(protoOrContext, propertyKey) {
		const hasPropertyKey = propertyKey !== undefined;
		return hasPropertyKey
			? legacy(protoOrContext, propertyKey)
			: standard(protoOrContext);
	}

	return decorator;
}
