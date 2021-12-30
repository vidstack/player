import type { EventObject, StateMachine, Typestate } from '@xstate/fsm';
import type { ReactiveControllerHost } from 'lit';

import type { Context, ContextConsumerController } from '../context';

/**
 * Helper function to subscribe to an Xstate service for the life of the given `host`, meaning when
 * it's disconnected from the DOM, the subscription is destroyed.
 */
export function hostedServiceSubscription<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ServiceContext extends object,
  ServiceEvents extends EventObject,
  ServiceStates extends Typestate<ServiceContext>
>(
  host: ReactiveControllerHost & EventTarget,
  service:
    | StateMachine.Service<ServiceContext, ServiceEvents, ServiceStates>
    | Context<
        StateMachine.Service<ServiceContext, ServiceEvents, ServiceStates>
      >,
  onChange: (
    state: StateMachine.Service<
      ServiceContext,
      ServiceEvents,
      ServiceStates
    >['state']
  ) => void
) {
  let consumer:
    | ContextConsumerController<
        StateMachine.Service<ServiceContext, ServiceEvents, ServiceStates>
      >
    | undefined;

  if ('id' in service) {
    consumer = service.consume(host);
  }

  let unsubscribe: () => void;

  host.addController({
    hostConnected() {
      ({ unsubscribe } = (
        consumer?.value ??
        (service as StateMachine.Service<
          ServiceContext,
          ServiceEvents,
          ServiceStates
        >)
      ).subscribe(onChange));
    },
    hostDisconnected() {
      unsubscribe?.();
    }
  });
}
