import {
  isReactiveElementConstructor,
  throwIfTC39Decorator
} from '../decorators.js';
import { ElementDiscoveryController } from './ElementDiscoveryController.js';

const CONTROLLER = Symbol('Vidstack.discoveryController');

/**
 * @param {keyof GlobalEventHandlersEventMap} eventType
 * @returns {ClassDecorator}
 */
export function discover(eventType) {
  return function (ctor) {
    const decoratorName = discover.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, ctor);

    if (isReactiveElementConstructor(decoratorName, ctor)) {
      ctor.addInitializer((host) => {
        host[CONTROLLER] = new ElementDiscoveryController(host, eventType);
      });
    }
  };
}
