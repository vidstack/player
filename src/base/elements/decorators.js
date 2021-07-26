import { isUndefined } from '@utils/unit.js';

/**
 * @param {string} decoratorName
 * @param {any} proto
 * @returns {proto is { constructor: typeof import('lit').ReactiveElement }}
 */
export function isReactiveElementProto(decoratorName, proto) {
  return isReactiveElementConstructor(decoratorName, proto.constructor);
}

/**
 * @param {string} decoratorName
 * @param {any} ctor
 * @returns {ctor is typeof import('lit').ReactiveElement}
 */
export function isReactiveElementConstructor(decoratorName, ctor) {
  if (isUndefined(ctor.addInitializer)) {
    throw Error(
      `[vds]: \`${ctor.name}\` must extend \`ReactiveElement\` to use the \`@${decoratorName}\` decorator.`
    );
  }

  return true;
}

/**
 * TC39 Decorator
 *
 * @param {string} decoratorName
 * @param {any} context
 * @link https://github.com/tc39/proposal-decorators
 */
export function throwIfTC39Decorator(decoratorName, context) {
  if (Object.hasOwnProperty.call(context, 'kind')) {
    throw Error(`[@${decoratorName}] TC39 decorators are not supported yet.`);
  }
}
