import type { EventObject, StateMachine, Typestate } from '@xstate/fsm';
import type { ReactiveControllerHost } from 'lit';

import type { Context } from '../context';

export function subscribeToService<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ServiceContext extends object,
  ServiceEvents extends EventObject,
  ServiceStates extends Typestate<ServiceContext>
>(
  host: ReactiveControllerHost & EventTarget,
  context: Context<
    StateMachine.Service<ServiceContext, ServiceEvents, ServiceStates>
  >,
  onChange: (
    state: StateMachine.State<ServiceContext, ServiceEvents, ServiceStates>
  ) => void
) {
  const consumer = context.consume(host);

  let unsubscribe: () => void;

  host.addController({
    hostConnected() {
      ({ unsubscribe } = consumer.value.subscribe(onChange));
    },
    hostDisconnected() {
      unsubscribe?.();
    }
  });
}
