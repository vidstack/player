import { isUndefined } from '../../utils/unit';
import {
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsEventInit,
} from '../events';
import { Callback, Constructor, Unsubscribe } from '../types.utils';

/**
 * Mixes in the ability to dispatch events and for consumers to add event listeners to be notified.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function WithEvents<EventRecordType>(Base: Constructor) {
  return class WithEvents extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventListeners = new Map<keyof EventRecordType, Callback<any>[]>();

    addEventListener<EventType extends keyof EventRecordType>(
      type: EventType,
      listener: Callback<EventRecordType[EventType]>,
    ): Unsubscribe {
      const callbacks = this.eventListeners.get(type) ?? [];
      callbacks.push(listener);
      this.eventListeners.set(type, callbacks);
      return () => {
        this.removeEventListener(type, listener);
      };
    }

    removeEventListener<EventType extends keyof EventRecordType>(
      type: EventType,
      listener: Callback<EventRecordType[EventType]>,
    ): void {
      let callbacks = this.eventListeners.get(type);
      if (!isUndefined(callbacks)) {
        callbacks = callbacks.filter(cb => cb !== listener);
      }
    }

    dispatchEvent<EventType extends keyof EventRecordType>(
      typeArg: EventType,
      eventInit: VdsEventInit<
        ExtractEventDetailType<EventRecordType[EventType]>
      >,
    ): void {
      const event = new VdsCustomEvent(typeArg as string, eventInit);
      this.eventListeners.get(typeArg)?.forEach(callback => callback(event));
    }

    destroy() {
      this.eventListeners.clear();
    }
  };
}
