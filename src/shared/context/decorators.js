/**
 * DOCUMENTATION
 *
 * @param {import("../../types/context").Context<any>} context
 * @return {any}
 */
export function consumeContext(context) {
	/**
	 * Legacy Decorator
	 *
	 * @param {any} proto
	 * @param {PropertyKey} name
	 * @link https://www.typescriptlang.org/docs/handbook/decorators.html
	 */
	function legacy(proto, name) {
		console.log(proto);
	}

	/**
	 * TC39 Decorator
	 *
	 * @param {{ key: string }} context
	 * @link https://github.com/tc39/proposal-decorators
	 */
	function standard(context) {
		// TODO: implement
		throw Error('[consumeContext] TC39 decorators are not supported yet.');
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

export function provideContext() {
	//
}
