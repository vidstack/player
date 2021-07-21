import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { isFunction, isNil, isString } from '../../utils/unit.js';
import { listen as listenToEvent } from '../events/index.js';

export class EventListenerDirective extends AsyncDirective {
  /**
   * @protected
   * @type {Element | undefined}
   */
  _element;

  /**
   * @protected
   * @type {object | undefined}
   */
  _host;

  /**
   * @protected
   * @type {string | undefined}
   */
  _type;

  /**
   * @protected
   * @type {((...args: any) => void) | undefined}
   */
  _handler;

  /**
   * @protected
   * @type {boolean | AddEventListenerOptions | EventListenerOptions | undefined}
   */
  _options;

  /**
   * @protected
   * @type {(() => void) | undefined}
   */
  _dispose;

  /**
   * @param {import('lit/directive').PartInfo} partInfo
   */
  constructor(partInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `on` directive must be used on an element tag.');
    }
  }

  /**
   * @template {keyof GlobalEventHandlersEventMap} EventType
   * @param {EventType} type - The name of the event to listen to.
   * @param {(event: GlobalEventHandlersEventMap[EventType]) => void} handler - The function to be called when the event is fired.
   * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
   * @returns {typeof nothing}
   */
  render(type, handler, options) {
    return nothing;
  }

  /**
   * @param {import('lit').ElementPart} part
   * @param {Parameters<this['render']>} params
   * @returns {typeof nothing}
   */
  update(part, [type, handler, options]) {
    if (
      this._element !== part.element ||
      this._type !== type ||
      this._handler !== handler ||
      this._options !== options ||
      this._host !== part.options?.host
    ) {
      this._element = part.element;
      this._type = type;
      this._handler = handler;
      this._options = options;
      this._host = part.options?.host;
      this._removeEventListener();
      this._addEventListener();
    }

    return nothing;
  }

  /**
   * @protected
   */
  _addEventListener() {
    if (
      isNil(this._element) ||
      !isString(this._type) ||
      !isFunction(this._handler)
    ) {
      return;
    }

    this._dispose = listenToEvent(
      this._element,
      this._type,
      this._handler.bind(this._host ?? this._element),
      this._options
    );
  }

  /**
   * @protected
   */
  _removeEventListener() {
    this._dispose?.();
    this._dispose = undefined;
  }

  /**
   * @protected
   */
  reconnected() {
    this._addEventListener();
  }

  /**
   * @protected
   */
  disconnected() {
    this._removeEventListener();
  }
}

/**
 * @typedef {<T extends keyof GlobalEventHandlersEventMap>(
 *   type: T,
 *   event: (event: GlobalEventHandlersEventMap[T]) => void,
 *   options?:  boolean | AddEventListenerOptions | EventListenerOptions
 * ) => import('lit/directive').DirectiveResult<typeof EventListenerDirective>}
 * EventListenerDirectiveResult
 */

export const on = /** @type {EventListenerDirectiveResult} */ (
  directive(EventListenerDirective)
);
