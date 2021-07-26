import { isNil, isString } from '@utils/unit.js';
import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { listen, redispatchEvent } from '../events/index.js';

export class ForwardEventDirective extends AsyncDirective {
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
   * @type {(keyof GlobalEventHandlersEventMap) | undefined}
   */
  _type;

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
      throw new Error(
        'The `forwardEvent` directive must be used on an element tag.'
      );
    }
  }

  /**
   * @param {keyof GlobalEventHandlersEventMap} type - The name of the event to listen to.
   * @returns {typeof nothing}
   */
  render(type) {
    return nothing;
  }

  /**
   * @param {import('lit').ElementPart} part
   * @param {Parameters<this['render']>} params
   * @returns {typeof nothing}
   */
  update(part, [type]) {
    if (
      this._element !== part.element ||
      this._type !== type ||
      this._host !== part.options?.host
    ) {
      this._element = part.element;
      this._type = type;
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
    if (isNil(this._element) || isNil(this._host) || !isString(this._type)) {
      return;
    }

    this._dispose = listen(this._element, this._type, (e) => {
      redispatchEvent(this._host, e);
    });
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

export const forwardEvent = directive(ForwardEventDirective);
