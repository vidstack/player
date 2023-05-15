import { effect, hasProvidedContext, peek, provideContext, signal } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  prop,
  type HTMLCustomElement,
} from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../../utils/dom';
import { menuContext } from '../menu-context';
import { radioGroupContext, type RadioController } from './context';

declare global {
  interface MaverickElements {
    'media-radio-group': MediaRadioGroupElement;
  }
}

/**
 * A radio group consists of options where only one of them can be checked. Each option is
 * provided as a radio (i.e., a selectable element).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/radio-group}
 * @slot - Used to insert radio options.
 * @example
 * ```html
 * <media-radio-group value="720">
 *   <media-radio value="1080">1080p</media-radio>
 *   <media-radio value="720">720p</media-radio>
 *   <!-- ... -->
 * </media-radio-group>
 * ```
 */
export class RadioGroup extends Component<RadioGroupAPI> {
  static el = defineElement<RadioGroupAPI>({
    tagName: 'media-radio-group',
    props: { value: '' },
  });

  protected _group = new Set<RadioController>();
  protected _value = signal('');

  /**
   * A list of radio values that belong this group.
   */
  @prop
  get values(): string[] {
    return Array.from(this._group).map((radio) => radio._value());
  }

  /**
   * The radio value that is checked in this group.
   */
  @prop
  get value() {
    return this._value();
  }

  set value(value) {
    this._onChange(value);
  }

  constructor(instance: ComponentInstance<RadioGroupAPI>) {
    super(instance);
    provideContext(radioGroupContext, {
      add: this._addRadio.bind(this),
      remove: this._removeRadio.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, 'role', 'radiogroup');
    this._watchValueProp();
    this.setAttributes({ value: this._value });
  }

  protected override onConnect() {
    effect(this._watchValueProp.bind(this));
  }

  protected override onDestroy() {
    this._group.clear();
  }

  protected _addRadio(radio: RadioController) {
    if (this._group.has(radio)) return;

    this._group.add(radio);
    radio._onCheck = this._onChangeBind;

    radio._check(radio._value() === this._value());
  }

  protected _removeRadio(radio: RadioController) {
    radio._onCheck = null;
    this._group.delete(radio);
  }

  protected _watchValueProp() {
    this._onChange(this.$props.value());
  }

  protected _onChangeBind = this._onChange.bind(this);
  protected _onChange(newValue: string, trigger?: Event) {
    const currentValue = peek(this._value);

    if (!newValue || newValue === currentValue) return;

    const currentRadio = this._findRadio(currentValue),
      newRadio = this._findRadio(newValue);

    currentRadio?._check(false, trigger);
    newRadio?._check(true, trigger);

    this._value.set(newValue);
    this.dispatch('change', { trigger });
  }

  protected _findRadio(newValue: string) {
    for (const radio of this._group) {
      if (newValue === peek(radio._value)) return radio;
    }

    return null;
  }
}

export interface RadioGroupAPI {
  props: RadioGroupProps;
  events: RadioGroupEvents;
}

export interface RadioGroupProps {
  /**
   * The radio value that is checked in this group.
   */
  value: string;
}

export interface RadioGroupEvents {
  change: RadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 */
export interface RadioGroupChangeEvent extends DOMEvent<void> {
  target: MediaRadioGroupElement;
}

export interface MediaRadioGroupElement extends HTMLCustomElement<RadioGroup> {}
