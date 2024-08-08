import {
  Component,
  effect,
  hasProvidedContext,
  onDispose,
  peek,
  prop,
  scoped,
  signal,
  useContext,
  type ReadSignal,
} from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { FocusVisibleController } from '../../../../foundation/observers/focus-visible';
import { $ariaBool } from '../../../../utils/aria';
import { onPress, setAttributeIfEmpty } from '../../../../utils/dom';
import { menuContext } from '../menu-context';
import { radioControllerContext, type RadioController } from './radio-controller';

/**
 * A radio represents a option that a user can select inside of a radio group. Only one radio
 * can be checked in a group.
 *
 * @attr data-checked - Whether radio is checked.
 * @attr data-focus - Whether radio is being keyboard focused.
 * @attr data-hocus - Whether radio is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/radio}
 */
export class Radio extends Component<RadioProps, {}, RadioEvents> {
  static props: RadioProps = {
    value: '',
  };

  #checked = signal(false);

  #controller: RadioController = {
    value: this.$props.value,
    check: this.#check.bind(this),
    onCheck: null,
  };

  /**
   * Whether this radio is currently checked.
   */
  @prop
  get checked(): boolean {
    return this.#checked();
  }

  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onSetup(): void {
    this.setAttributes({
      value: this.$props.value,
      'data-checked': this.#checked,
      'aria-checked': $ariaBool(this.#checked),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, 'tabindex', isMenuItem ? '-1' : '0');
    setAttributeIfEmpty(el, 'role', isMenuItem ? 'menuitemradio' : 'radio');
    effect(this.#watchValue.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    this.#addToGroup();
    onPress(el, this.#onPress.bind(this));
    onDispose(this.#onDisconnect.bind(this));
  }

  #onDisconnect() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this.#controller);
    }, this.connectScope);
  }

  #addToGroup() {
    const group = useContext(radioControllerContext);
    group.add(this.#controller);
  }

  #watchValue() {
    const { value } = this.$props,
      newValue = value();
    if (peek(this.#checked)) {
      this.#controller.onCheck?.(newValue);
    }
  }

  #onPress(event: Event) {
    if (peek(this.#checked)) return;

    this.#onChange(true, event);
    this.#onSelect(event);

    this.#controller.onCheck?.(peek(this.$props.value), event);
  }

  #check(value: boolean, trigger?: Event) {
    if (peek(this.#checked) === value) return;
    this.#onChange(value, trigger);
  }

  #onChange(value: boolean, trigger?: Event) {
    this.#checked.set(value);
    this.dispatch('change', { detail: value, trigger });
  }

  #onSelect(trigger?: Event) {
    this.dispatch('select', { trigger });
  }
}

export interface RadioProps {
  /** The radio value. */
  value: string;
}

export interface RadioEvents {
  change: RadioChangeEvent;
  select: RadioSelectEvent;
}

/**
 * Fired when the radio's checked value changes.
 *
 * @detail isSelected
 */
export interface RadioChangeEvent extends DOMEvent<boolean> {
  target: Radio;
}

/**
 * Fired when the radio is pressed via mouse, touch, or, keyboard. This will not fire if the radio
 * is programmatically selected.
 */
export interface RadioSelectEvent extends DOMEvent<void> {
  target: Radio;
}

export interface RadioOption {
  label: string | ReadSignal<string>;
  value: string;
}
