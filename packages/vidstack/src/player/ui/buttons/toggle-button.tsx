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
import { onPress, setAttributeIfEmpty } from '../../../utils/dom';
import { ARIAKeyShortcuts } from '../../core/keyboard/aria-shortcuts';
import type { MediaKeyShortcut } from '../../core/keyboard/types';
import { TooltipController } from '../tooltip/tooltip-controller';

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
    new TooltipController(instance);
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

  protected override onConnect(el: HTMLElement) {
    onPress(el, this._onMaybePress.bind(this));
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

    if (disabled) {
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
  interface MaverickElements {
    'media-toggle-button': MediaToggleButtonElement;
  }
}
