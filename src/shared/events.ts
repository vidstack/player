import { LitElement } from 'lit-element';

import { LIB_PREFIX } from './constants';
import { Callback, Unsubscribe, Writeable } from './types.utils';

export interface VdsEventInit<DetailType> extends CustomEventInit<DetailType> {
  readonly originalEvent?: Event;
}

export interface VdsCustomEventConstructor<DetailType> {
  readonly TYPE: string;
  new (eventInit?: VdsEventInit<DetailType>): VdsCustomEvent<DetailType>;
}

export type VdsEvents<EventRecordType> = {
  [EventType in Extract<
    keyof EventRecordType,
    string
  > as `${typeof LIB_PREFIX}-${EventType}`]: EventRecordType[EventType];
};

export type ExtractEventDetailType<Type> = Type extends VdsCustomEvent<infer X>
  ? X
  : void;

export class VdsCustomEvent<DetailType> extends CustomEvent<DetailType> {
  static readonly TYPE: string;

  readonly originalEvent?: Event;

  /**
   * Walks up the event chain (following each `originalEvent`) and returns the origin event
   * that started the chain.
   */
  get originEvent(): Event | undefined {
    let originalEvent = this.originalEvent as VdsCustomEvent<unknown>;

    while (originalEvent && originalEvent.originalEvent) {
      originalEvent = originalEvent.originalEvent as VdsCustomEvent<unknown>;
    }

    return originalEvent;
  }

  /**
   * Walks up the event chain (following each `originalEvent`) and determines whether the initial
   * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
   */
  get isOriginTrusted(): boolean {
    return this.originEvent?.isTrusted ?? false;
  }

  constructor(typeArg: string, eventInit?: VdsEventInit<DetailType>) {
    const { originalEvent, ...init } = eventInit ?? {};
    super(typeArg, init);
    this.originalEvent = originalEvent;
  }
}

export function redispatchNativeEvent(
  el: HTMLElement,
  originalEvent: Event,
): void {
  const event = new VdsCustomEvent(originalEvent.type, {
    originalEvent,
    bubbles: originalEvent.bubbles,
    cancelable: originalEvent.cancelable,
    composed: originalEvent.composed,
  });

  const constructor = (event.constructor as unknown) as Writeable<
    VdsCustomEventConstructor<unknown>
  >;

  constructor.TYPE = originalEvent.type;

  el.dispatchEvent(event);
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  constructor(private dispose: Callback<void>[] = []) {}

  add(callback: Callback<void>): void {
    this.dispose.push(callback);
  }

  empty(): void {
    this.dispose.forEach(fn => fn());
    this.dispose = [];
  }
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param target - The target to listen for the events on.
 * @param type - The name of the event to listen to.
 * @param listener - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 *
 * @example
 * ```typescript
 * const off = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * off();
 * ```
 */
export function listen(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | EventListenerOptions,
): Unsubscribe {
  target.addEventListener(type, listener, options);
  return () => {
    target.removeEventListener(type, listener, options);
  };
}

export interface EventListenerDecoratorOptions {
  target?: 'document' | 'window';
  capture?: boolean;
  passive?: boolean;
}

/**
 * Attaches an event listener to the host element or the given `target` and calls the decorated
 * method as the event handler. The event listener is automatically cleaned up when the element
 * is disconnected from the DOM.
 *
 * @param eventName - The name of the event to listen to.
 * @param options - Configures the event listener.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function eventListener(
  eventName: string,
  options: EventListenerDecoratorOptions = {},
) {
  return (element: LitElement, handlerName: string): void => {
    const { target, ...listenerOptions } = options;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventHandler = (element as any)[handlerName];

    let removeEventListener: Unsubscribe | undefined;

    const { connectedCallback } = element;
    element.connectedCallback = function (this: LitElement) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let eventTarget: EventTarget = this;

      if (target === 'document') eventTarget = document;
      else if (target === 'window') eventTarget = window;

      removeEventListener = listen(
        eventTarget,
        eventName,
        eventHandler.bind(this),
        listenerOptions,
      );

      connectedCallback?.call(this);
    };

    const { disconnectedCallback } = element;
    element.disconnectedCallback = function (this: LitElement) {
      removeEventListener?.();
      removeEventListener = undefined;
      disconnectedCallback?.call(this);
    };
  };
}
