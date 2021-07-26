import { isFunction, noop } from '@utils/unit';

import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../elements/decorators';
import { listen } from './events';

export type EventListenerDecoratorOptions =
  | boolean
  | EventListenerOptions
  | (AddEventListenerOptions & { target?: EventTarget });

/**
 * @param type - The name of the event to listen to.
 * @param options - Configures the event listener.
 */
export function eventListener<
  EventType extends keyof GlobalEventHandlersEventMap
>(
  type: EventType,
  options: EventListenerDecoratorOptions = {}
): MethodDecorator {
  return function (proto, methodName) {
    const decoratorName = eventListener.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, proto);

    if (isReactiveElementProto(decoratorName, proto)) {
      const ctor = proto.constructor;

      ctor.addInitializer((host) => {
        let dispose = noop;

        host.addController({
          hostConnected() {
            // @ts-expect-error
            if (!isFunction(host[methodName])) return;
            const target = (options as { target?: EventTarget }).target ?? host;
            // @ts-expect-error
            const listener = host[methodName].bind(host);
            dispose = listen(target, type, listener, options);
          },
          hostDisconnected() {
            dispose();
            dispose = noop;
          }
        });
      });
    }
  };
}
