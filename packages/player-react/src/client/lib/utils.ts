export function setProperty(node: Element, name: string, value: unknown, old: unknown) {
  if (name.startsWith('onVds') && value !== old) {
    // `onVdsPlay` -> `vds-play`
    const eventType = name
      .replace('on', '')
      .replace(/[A-Z]/g, (x) => `-${x[0].toLowerCase()}`)
      .slice(1);

    updateEventListener(node, eventType, value as (e?: Event) => void);
  } else {
    node[name] = value;
  }
}

export function setRef(ref: React.Ref<unknown>, value: Element | null) {
  if (typeof ref === 'function') {
    (ref as (e: Element | null) => void)(value);
  } else {
    (ref as { current: Element | null }).current = value;
  }
}

const eventHandlers: WeakMap<Element, Map<string, EventListenerObject>> = new WeakMap();

export function updateEventListener(
  node: Element,
  eventType: string,
  listener: (event?: Event) => void,
) {
  let events = eventHandlers.get(node);

  if (events === undefined) {
    eventHandlers.set(node, (events = new Map()));
  }

  let handler = events.get(eventType);

  if (listener !== undefined) {
    if (handler === undefined) {
      events.set(eventType, (handler = { handleEvent: listener }));
      node.addEventListener(eventType, handler);
    } else {
      handler.handleEvent = listener;
    }

    return;
  }

  if (handler !== undefined) {
    events.delete(eventType);
    node.removeEventListener(eventType, handler);
  }
}
