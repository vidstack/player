import { effect, hasProvidedContext, peek, signal, useContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  prop,
  type HTMLCustomElement,
} from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import { FocusVisibleController } from '../../../../foundation/observers/focus-visible';
import { $ariaBool } from '../../../../utils/aria';
import { onPress } from '../../../../utils/dom';
import { menuContext } from '../menu-context';
import { radioGroupContext, type RadioController } from './context';

declare global {
  interface MaverickElements {
    'media-radio': MediaRadioElement;
  }
}

/**
 * A radio represents a option that a user can select inside of a radio group. Only one radio
 * can be checked in a group.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/radio}
 * @slot - Used to insert content inside the radio such as the label.
 * @example
 * ```html
 * <media-radio-group value="720">
 *   <media-radio value="1080">1080p</media-radio>
 *   <media-radio value="720">720p</media-radio>
 *   <!-- ... -->
 * </media-radio-group>
 * ```
 */
export class Radio extends Component<RadioAPI> {
  static el = defineElement<RadioAPI>({
    tagName: 'media-radio',
    props: { value: '' },
  });

  protected _checked = signal(false);

  protected _controller: RadioController = {
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

  constructor(instance: ComponentInstance<RadioAPI>) {
    super(instance);
    new FocusVisibleController(instance);
  }

  protected override onAttach() {
    effect(this._watchValue.bind(this));

    this._addToGroup();

    const isMenuItem = hasProvidedContext(menuContext);
    this.setAttributes({
      value: this.$props.value,
      role: isMenuItem ? 'menuitemradio' : 'radio',
      tabindex: isMenuItem ? -1 : 0,
      'aria-checked': $ariaBool(this._checked),
    });
  }

  protected override onConnect(el: HTMLElement) {
    this._addToGroup();
    onPress(el, this._onPress.bind(this));
  }

  protected override onDisconnect() {
    const group = useContext(radioGroupContext);
    group.remove(this._controller);
  }

  protected _addToGroup() {
    const group = useContext(radioGroupContext);
    group.add(this._controller);
  }

  protected _watchValue() {
    const { value } = this.$props,
      newValue = value();
    if (peek(this._checked)) {
      this._controller._onCheck?.(newValue);
    }
  }

  protected _onPress(event: Event) {
    if (peek(this._checked)) return;
    this._checked.set(true);
    this.dispatch('change', { trigger: event });
    this._controller._onCheck?.(peek(this.$props.value), event);
  }

  protected _check(value: boolean, trigger?: Event) {
    if (peek(this._checked) === value) return;
    this._checked.set(value);
    this.dispatch('change', { trigger });
  }

  override render() {
    return <div part="check" />;
  }
}

export interface RadioAPI {
  props: RadioProps;
  events: RadioEvents;
}

export interface RadioProps {
  /** The radio value. */
  value: string;
}

export interface RadioEvents {
  change: RadioChangeEvent;
}

/**
 * Fired when the radio's checked value changes.
 */
export interface RadioChangeEvent extends DOMEvent<void> {
  target: MediaRadioElement;
}

export interface MediaRadioElement extends HTMLCustomElement<Radio> {}
