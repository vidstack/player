import { Component, effect, onDispose, prop, signal, useContext } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { onPress, setAttributeIfEmpty } from '../../../utils/dom';
import { menuContext, type MenuContext } from './menu-context';

/**
 * A button that controls the opening and closing of a menu component. The button will become a
 * menuitem when used inside a submenu.
 *
 * @attr data-root - Whether this is the root menu button.
 * @attr data-submenu - Whether menu button is part of a submenu.
 * @attr data-open - Whether menu is currently open.
 * @attr data-focus - Whether button is being keyboard focused.
 * @attr data-hocus - Whether button is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 */
export class MenuButton extends Component<MenuButtonProps, {}, MenuButtonEvents> {
  static props: MenuButtonProps = {
    disabled: false,
  };

  #menu!: MenuContext;
  #hintEl = signal<HTMLElement | null>(null);

  @prop
  get expanded() {
    return this.#menu?.expanded() ?? false;
  }

  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onSetup(): void {
    this.#menu = useContext(menuContext);
  }

  protected override onAttach(el: HTMLElement) {
    this.#menu.attachMenuButton(this);
    effect(this.#watchDisabled.bind(this));
    setAttributeIfEmpty(el, 'type', 'button');
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#watchHintEl.bind(this));

    this.#onMutation();
    const mutations = new MutationObserver(this.#onMutation.bind(this));
    mutations.observe(el, { attributeFilter: ['data-part'], childList: true, subtree: true });
    onDispose(() => mutations.disconnect());

    onPress(el, (trigger) => {
      this.dispatch('select', { trigger });
    });
  }

  #watchDisabled() {
    this.#menu.disableMenuButton(this.$props.disabled());
  }

  #watchHintEl() {
    const el = this.#hintEl();
    if (!el) return;
    effect(() => {
      const text = this.#menu.hint();
      if (text) el.textContent = text;
    });
  }

  #onMutation() {
    const hintEl = this.el?.querySelector<HTMLElement>('[data-part="hint"]');
    this.#hintEl.set(hintEl ?? null);
  }
}

export interface MenuButtonProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
}

export interface MenuButtonEvents {
  select: MenuButtonSelectEvent;
}

/**
 * Fired when the button is pressed via mouse, touch, or keyboard.
 */
export interface MenuButtonSelectEvent extends DOMEvent<void> {
  target: MenuButton;
}
