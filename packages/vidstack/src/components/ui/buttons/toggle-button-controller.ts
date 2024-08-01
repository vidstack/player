import { isWriteSignal, ViewController, type ReadSignal } from 'maverick.js';
import { ariaBool } from 'maverick.js/std';

import { ARIAKeyShortcuts } from '../../../core/keyboard/aria-shortcuts';
import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { onPress, setAttributeIfEmpty } from '../../../utils/dom';

export interface ToggleButtonControllerProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
}

export interface ToggleButtonDelegate {
  isPresssed: ReadSignal<boolean>;
  keyShortcut?: string;
  onPress?(event: Event): void;
}

export class ToggleButtonController extends ViewController<ToggleButtonControllerProps> {
  static props: ToggleButtonControllerProps = {
    disabled: false,
  };

  #delegate: ToggleButtonDelegate;

  constructor(delegate: ToggleButtonDelegate) {
    super();
    this.#delegate = delegate;
    new FocusVisibleController();
    if (delegate.keyShortcut) {
      new ARIAKeyShortcuts(delegate.keyShortcut);
    }
  }

  protected override onSetup(): void {
    const { disabled } = this.$props;
    this.setAttributes({
      'data-pressed': this.#delegate.isPresssed,
      'aria-pressed': this.#isARIAPressed.bind(this),
      'aria-disabled': () => (disabled() ? 'true' : null),
    });
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'role', 'button');
    setAttributeIfEmpty(el, 'type', 'button');
  }

  protected override onConnect(el: HTMLElement) {
    const events = onPress(el, this.#onMaybePress.bind(this));

    // Prevent these events too when toggle is disabled.
    for (const type of ['click', 'touchstart'] as const) {
      events.add(type, this.#onInteraction.bind(this), {
        passive: true,
      });
    }
  }

  #isARIAPressed() {
    return ariaBool(this.#delegate.isPresssed());
  }

  #onPressed(event: Event) {
    if (isWriteSignal(this.#delegate.isPresssed)) {
      this.#delegate.isPresssed.set((p) => !p);
    }
  }

  #onMaybePress(event: Event) {
    const disabled = this.$props.disabled() || this.el!.hasAttribute('data-disabled');

    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    event.preventDefault();
    (this.#delegate.onPress ?? this.#onPressed).call(this, event);
  }

  #onInteraction(event: Event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
