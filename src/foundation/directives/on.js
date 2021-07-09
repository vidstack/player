import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { isFunction, isNil, isString, noop } from '../../utils/unit.js';
import { listen as listenToEvent } from '../events/index.js';

export class EventListenerDirective extends AsyncDirective {
  /**
   * @protected
   * @type {Element | undefined}
   */
  element;

  /**
   * @protected
   * @type {object | undefined}
   */
  host;

  /**
   * @protected
   * @type {string | undefined}
   */
  type;

  /**
   * @protected
   * @type {((...args: any) => void) | undefined}
   */
  handler;

  /**
   * @protected
   * @type {boolean | AddEventListenerOptions | EventListenerOptions | undefined}
   */
  options;

  /**
   * @protected
   * @type {() => void}
   */
  dispose = noop;

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
      this.element !== part.element ||
      this.type !== type ||
      this.handler !== handler ||
      this.options !== options ||
      this.host !== part.options?.host
    ) {
      this.element = part.element;
      this.type = type;
      this.handler = handler;
      this.options = options;
      this.host = part.options?.host;
      this.addEventListener();
    }

    return nothing;
  }

  /**
   * @protected
   */
  addEventListener() {
    if (
      isNil(this.element) ||
      !isString(this.type) ||
      !isFunction(this.handler)
    ) {
      this.dispose();
      this.dispose = noop;
      return;
    }

    const dispose = listenToEvent(
      this.element,
      this.type,
      this.handler.bind(this.host ?? this.element),
      this.options
    );

    this.dispose();
    this.dispose = dispose;
  }

  /**
   * @protected
   */
  reconnected() {
    this.addEventListener();
  }

  /**
   * @protected
   */
  disconnected() {
    this.dispose();
    this.dispose = noop;
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
