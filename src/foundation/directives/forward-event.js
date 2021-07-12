import { nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType } from 'lit/directive.js';

import { isNil, isString } from '../../utils/unit.js';
import { listen, redispatchEvent } from '../events/index.js';

export class ForwardEventDirective extends AsyncDirective {
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
   * @type {(() => void) | undefined}
   */
  dispose;

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
      this.element !== part.element ||
      this.type !== type ||
      this.host !== part.options?.host
    ) {
      this.element = part.element;
      this.type = type;
      this.host = part.options?.host;
      this.removeEventListener();
      this.addEventListener();
    }

    return nothing;
  }

  /**
   * @protected
   */
  addEventListener() {
    if (isNil(this.element) || isNil(this.host) || !isString(this.type)) {
      return;
    }

    this.dispose = listen(this.element, this.type, (e) => {
      redispatchEvent(this.host, e);
    });
  }

  /**
   * @protected
   */
  removeEventListener() {
    this.dispose?.();
    this.dispose = undefined;
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
    this.removeEventListener();
  }
}

export const forwardEvent = directive(ForwardEventDirective);
