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

  private _checked = signal(false);

  private _controller: RadioController = {
    _value: this.$props.value,
    _check: this._check.bind(this),
    _onCheck: null,
  };

  /**
   * Whether this radio is currently checked.
   */
  @prop
  get checked(): boolean {
    return this._checked();
  }

  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onSetup(): void {
    this.setAttributes({
      value: this.$props.value,
      'data-checked': this._checked,
      'aria-checked': $ariaBool(this._checked),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, 'tabindex', isMenuItem ? '-1' : '0');
    setAttributeIfEmpty(el, 'role', isMenuItem ? 'menuitemradio' : 'radio');
    effect(this._watchValue.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    this._addToGroup();
    onPress(el, this._onPress.bind(this));
    onDispose(this._onDisconnect.bind(this));
  }

  private _onDisconnect() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this._controller);
    }, this.connectScope);
  }

  private _addToGroup() {
    const group = useContext(radioControllerContext);
    group.add(this._controller);
  }

  private _watchValue() {
    const { value } = this.$props,
      newValue = value();
    if (peek(this._checked)) {
      this._controller._onCheck?.(newValue);
    }
  }

  private _onPress(event: Event) {
    if (peek(this._checked)) return;

    this._onChange(true, event);
    this._onSelect(event);

    this._controller._onCheck?.(peek(this.$props.value), event);
  }

  private _check(value: boolean, trigger?: Event) {
    if (peek(this._checked) === value) return;
    this._onChange(value, trigger);
  }

  private _onChange(value: boolean, trigger?: Event) {
    this._checked.set(value);
    this.dispatch('change', { detail: value, trigger });
  }

  private _onSelect(trigger?: Event) {
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
