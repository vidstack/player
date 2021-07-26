import { isNil, isString } from '@utils/unit';
import { ElementPart, nothing } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartInfo, PartType } from 'lit/directive.js';

import { listen, redispatchEvent } from '../events/index';

export class ForwardEventDirective extends AsyncDirective {
  protected _element?: Element;

  protected _host?: EventTarget;

  protected _type?: keyof GlobalEventHandlersEventMap;

  protected _dispose?: () => void;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'The `forwardEvent` directive must be used on an element tag.'
      );
    }
  }

  render(type: keyof GlobalEventHandlersEventMap): typeof nothing {
    return nothing;
  }

  override update(
    part: ElementPart,
    [type]: Parameters<this['render']>
  ): typeof nothing {
    if (
      this._element !== part.element ||
      this._type !== type ||
      this._host !== part.options?.host
    ) {
      this._element = part.element;
      this._type = type;
      this._host = part.options?.host as EventTarget;
      this._removeEventListener();
      this._addEventListener();
    }

    return nothing;
  }

  protected _addEventListener() {
    if (isNil(this._element) || isNil(this._host) || !isString(this._type)) {
      return;
    }

    this._dispose = listen(this._element, this._type, (e: Event) => {
      redispatchEvent(this._host!, e);
    });
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
 * @param type - The name of the event to listen to and forward.
 */
export const forwardEvent = directive(ForwardEventDirective);
