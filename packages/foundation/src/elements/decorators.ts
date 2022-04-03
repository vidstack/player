import { ReactiveElement } from 'lit';

import { isUndefined } from '../utils/unit';

export function isReactiveElementProto(
  decoratorName: string,
  proto: any,
): proto is { constructor: typeof ReactiveElement } {
  return isReactiveElementConstructor(decoratorName, proto.constructor);
}

export function isReactiveElementConstructor(
  decoratorName: string,
  ctor: any,
): ctor is typeof ReactiveElement {
  if (isUndefined(ctor.addInitializer)) {
    throw Error(
      `[vds]: \`${ctor.name}\` must extend \`ReactiveElement\` to use the \`@${decoratorName}\` decorator.`,
    );
  }

  return true;
}

/**
 * TC39 Decorator
 *
 * @param decoratorName
 * @param context
 * @see {@link https://github.com/tc39/proposal-decorators}
 */
export function throwIfTC39Decorator(decoratorName: string, context: any) {
  if (Object.hasOwnProperty.call(context, 'kind')) {
    throw Error(`[@${decoratorName}] TC39 decorators are not supported yet.`);
  }
}
