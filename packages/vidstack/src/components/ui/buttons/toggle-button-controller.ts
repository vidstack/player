import { isWriteSignal, ViewController, type ReadSignal } from 'maverick.js';
import { ariaBool } from 'maverick.js/std';

import { ARIAKeyShortcuts } from '../../../core';
import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { onPress, setAttributeIfEmpty } from '../../../utils/dom';

export interface ToggleButtonControllerProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
}

export interface ToggleButtonDelegate {
  _isPressed: ReadSignal<boolean>;
  _keyShortcut?: string;
  _onPress?(event: Event): void;
}

export class ToggleButtonController extends ViewController<ToggleButtonControllerProps> {
  static props: ToggleButtonControllerProps = {
    disabled: false,
  };

  constructor(private _delegate: ToggleButtonDelegate) {
    super();
    new FocusVisibleController();
    if (_delegate._keyShortcut) {
      new ARIAKeyShortcuts(_delegate._keyShortcut);
    }
  }

  protected override onSetup(): void {
    const { disabled } = this.$props;
    this.setAttributes({
      'data-pressed': this._delegate._isPressed,
      'aria-pressed': this._isARIAPressed.bind(this),
      'aria-disabled': () => (disabled() ? 'true' : null),
    });
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');
    setAttributeIfEmpty(el, 'type', 'button');
  }

  protected override onConnect(el: HTMLElement) {
    onPress(el, this._onMaybePress.bind(this));

    // Prevent these events too when toggle is disabled.
    for (const type of ['click', 'touchstart'] as const) {
      this.listen(type, this._onInteraction.bind(this));
    }
  }

  protected _isARIAPressed() {
    return ariaBool(this._delegate._isPressed());
  }

  protected _onPressed(event: Event) {
    if (isWriteSignal(this._delegate._isPressed)) {
      this._delegate._isPressed.set((p) => !p);
    }
  }

  protected _onMaybePress(event: Event) {
    const disabled = this.$props.disabled() || this.el!.hasAttribute('data-disabled');

    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    event.preventDefault();
    (this._delegate._onPress ?? this._onPressed).call(this, event);
  }

  protected _onInteraction(event: Event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
