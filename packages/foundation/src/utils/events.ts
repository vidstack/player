export type GlobalEventHandlerMap = {
  [EventType in keyof GlobalEventHandlersEventMap]?: (
    event: GlobalEventHandlersEventMap[EventType],
  ) => void | Promise<void>;
};

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param target - The target to listen for the events on.
 * @param type - The name of the event to listen to.
 * @param listener - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 * @returns Stop listening cleanup function.
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen<EventType extends keyof GlobalEventHandlerMap>(
  target: EventTarget,
  type: EventType,
  listener: GlobalEventHandlerMap[EventType],
  options?: boolean | EventListenerOptions | AddEventListenerOptions,
): () => void {
  target.addEventListener(type, listener as EventListener, options);

  return () => {
    target.removeEventListener(type, listener as EventListener, options);
  };
}

function eventTypeIncludes(event: Event | undefined, types: string[]) {
  return types.some((type) => event?.type.includes(type) ?? false);
}

export function isPointerEvent(event: Event | undefined): event is PointerEvent {
  return eventTypeIncludes(event, ['pointer']);
}

export function isTouchEvent(event: Event | undefined): event is TouchEvent {
  return eventTypeIncludes(event, ['touch']);
}

export function isMouseEvent(event: Event | undefined): event is MouseEvent {
  return eventTypeIncludes(event, ['click', 'mouse']);
}
export async function waitForEvent<EventType extends keyof GlobalEventHandlersEventMap>(
  target: EventTarget,
  type: EventType,
  options?: (EventListenerOptions | AddEventListenerOptions) & {
    timeout?: number;
  },
): Promise<GlobalEventHandlersEventMap[EventType]> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      reject(`Timed out waiting for event \`${type}\`.`);
    }, options?.timeout ?? 1000);

    listen(
      target,
      type,
      (event: any) => {
        window.clearTimeout(timerId);
        resolve(event);
      },
      options,
    );
  });
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
  // @ts-expect-error
  protected _disposal: (() => void)[] = this._disposal ?? [];

  add(...callbacks: (() => void)[]) {
    if (callbacks) {
      callbacks.forEach((cb) => {
        this._disposal.push(cb);
      });
    }
  }

  /**
   * Dispose callbacks.
   */
  empty() {
    this._disposal.forEach((fn) => fn());
    this._disposal = [];
  }
}
