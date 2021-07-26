import { isFunction, isNil, isString } from '@utils/unit';
import { ElementPart, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import {
  directive,
  DirectiveResult,
  PartInfo,
  PartType
} from 'lit/directive.js';

import { listen as listenToEvent } from '../events/index';

export class EventListenerDirective extends AsyncDirective {
  protected _element?: Element;

  protected _host?: EventTarget;

  protected _type?: keyof GlobalEventHandlersEventMap;

  protected _listener?: (...args: any) => void;

  protected _options?: boolean | AddEventListenerOptions | EventListenerOptions;

  protected _dispose?: () => void;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `on` directive must be used on an element tag.');
    }
  }

  render<EventType extends keyof GlobalEventHandlersEventMap>(
    type: EventType,
    listener: (event: GlobalEventHandlersEventMap[EventType]) => void,
    options?: boolean | AddEventListenerOptions | EventListenerOptions
  ): typeof nothing {
    return nothing;
  }

  override update(
    part: ElementPart,
    [type, listener, options]: Parameters<this['render']>
  ): typeof nothing {
    if (
      this._element !== part.element ||
      this._type !== type ||
      this._listener !== listener ||
      this._options !== options ||
      this._host !== part.options?.host
    ) {
      this._element = part.element;
      this._type = type;
      this._listener = listener;
      this._options = options;
      this._host = part.options?.host as EventTarget;
      this._removeEventListener();
      this._addEventListener();
    }

    return nothing;
  }

  protected _addEventListener() {
    if (
      isNil(this._element) ||
      !isString(this._type) ||
      !isFunction(this._listener)
    ) {
      return;
    }

    this._dispose = listenToEvent(
      this._element,
      this._type,
      this._listener!.bind(this._host ?? this._element),
      this._options
    );
  }

  protected _removeEventListener() {
    this._dispose?.();
    this._dispose = undefined;
  }

  protected override reconnected() {
    this._addEventListener();
  }

  protected override disconnected() {
    this._removeEventListener();
  }
}

/**
 * @param type - The name of the event to listen to.
 * @param listener - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 */
export const on: <EventType extends keyof GlobalEventHandlersEventMap>(
  type: EventType,
  listener: (event: GlobalEventHandlersEventMap[EventType]) => void,
  options?: boolean | AddEventListenerOptions | EventListenerOptions
) => DirectiveResult<typeof EventListenerDirective> = directive(
  EventListenerDirective
);
