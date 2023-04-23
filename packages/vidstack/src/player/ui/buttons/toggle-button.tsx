import { isWriteSignal, peek, signal, type ReadSignal, type WriteSignal } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  prop,
  type HTMLCustomElement,
  type PropDeclarations,
} from 'maverick.js/element';
import { ariaBool, isKeyboardClick, isKeyboardEvent } from 'maverick.js/std';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import { ARIAKeyShortcuts } from '../../core/keyboard/aria-shortcuts';
import type { MediaKeyShortcut } from '../../core/keyboard/types';

export const toggleButtonProps: PropDeclarations<ToggleButtonProps> = {
  disabled: false,
  defaultPressed: false,
  defaultAppearance: false,
};

/**
 * A toggle button is a two-state button that can be either off (not pressed) or on (pressed).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/toggle-button}
 * @slot - Used to passing in content for showing pressed and not pressed states.
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-toggle-button aria-label="...">
 *   <svg slot="on">...</svg>
 *   <svg slot="off">...</svg>
 * </media-toggle-button>
 * ```
 */
export class ToggleButton<T extends ToggleButtonAPI = ToggleButtonAPI> extends Component<T> {
  static el = defineElement<ToggleButtonAPI>({
    tagName: 'media-toggle-button',
    props: toggleButtonProps,
  });

  protected _pressed: ReadSignal<boolean> | WriteSignal<boolean> = signal(false);
  protected _keyShortcut?: MediaKeyShortcut;

  constructor(instance: ComponentInstance<T>) {
    super(instance);
    new FocusVisibleController(instance);
    if (this._keyShortcut) new ARIAKeyShortcuts(instance, this._keyShortcut);
  }

  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  @prop
  get pressed() {
    return peek(this._pressed);
  }

  protected override onAttach(el: HTMLElement) {
    if (isWriteSignal(this._pressed)) {
      this._pressed.set(this.$props.defaultPressed());
    }

    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');

    const { disabled, defaultAppearance } = this.$props;
    this.setAttributes({
      disabled,
      'default-appearance': defaultAppearance,
      'data-pressed': this._pressed,
      'aria-pressed': this._isARIAPressed.bind(this),
      'data-media-button': true,
    });
  }

  protected override onConnect() {
    const clickEvents = ['pointerup', 'keydown'] as const,
      handlePress = this._onMaybePress.bind(this);
    for (const eventType of clickEvents) this.listen(eventType, handlePress);
  }

  protected _isARIAPressed() {
    return ariaBool(this._pressed());
  }

  protected _onPress(event: Event) {
    if (isWriteSignal(this._pressed)) {
      this._pressed.set((p) => !p);
    }
  }

  protected _onMaybePress(event: Event) {
    const disabled = this.$props.disabled();

    if (disabled || (isKeyboardEvent(event) && !isKeyboardClick(event))) {
      if (disabled) event.stopImmediatePropagation();
      return;
    }

    event.preventDefault();
    this._onPress(event);
  }
}

export interface ToggleButtonAPI {
  props: ToggleButtonProps;
}

export interface ToggleButtonProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
  /**
   * Whether the default button appearance should stay visible when elements have been passed inside
   * it.
   */
  defaultAppearance: boolean;
  /**
   * Whether it should start in the on (pressed) state. This prop is only available on the base
   * `<media-toggle-button>`.
   */
  defaultPressed: boolean;
}

export interface MediaToggleButtonElement extends HTMLCustomElement<ToggleButton> {}

declare global {
  interface HTMLElementTagNameMap {
    'media-toggle-button': MediaToggleButtonElement;
  }
}
