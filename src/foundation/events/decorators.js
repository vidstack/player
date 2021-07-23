import { noop } from '../../utils/unit.js';
import {
  isReactiveElementProto,
  throwIfTC39Decorator
} from '../elements/decorators.js';
import { listen } from './events.js';

/**
 * @typedef {boolean |
 *   EventListenerOptions |
 *   (AddEventListenerOptions & { target?: EventTarget })
 * } EventListenerDecoratorOptions
 */

/**
 * @template {keyof GlobalEventHandlersEventMap} EventType
 * @param {EventType} type - The name of the event to listen to.
 * @param {EventListenerDecoratorOptions} [options] - Configures the event listener.
 * @returns {MethodDecorator}
 */
export function eventListener(type, options = {}) {
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
            const target =
              /** @type {{ target?: EventTarget }} */ (options).target ?? host;
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
