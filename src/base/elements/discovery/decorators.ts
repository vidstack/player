import {
  isReactiveElementConstructor,
  throwIfTC39Decorator
} from '../decorators';
import { ElementDiscoveryController } from './ElementDiscoveryController';

export function discover(
  eventType: keyof GlobalEventHandlersEventMap
): ClassDecorator {
  return function (ctor) {
    const decoratorName = discover.name;

    // TODO: implement when spec formalized.
    throwIfTC39Decorator(decoratorName, ctor);

    if (isReactiveElementConstructor(decoratorName, ctor)) {
      ctor.addInitializer((host) => {
        host[Symbol('Vidstack.discoveryController')] =
          new ElementDiscoveryController(host, eventType);
      });
    }
  };
}
