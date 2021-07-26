import {
  isReactiveElementConstructor,
  throwIfTC39Decorator
} from '../decorators';
import { ElementDiscoveryController } from './ElementDiscoveryController';

const CONTROLLER = Symbol('Vidstack.discoveryController');

export function discover(
  eventType: keyof GlobalEventHandlersEventMap
): ClassDecorator {
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
