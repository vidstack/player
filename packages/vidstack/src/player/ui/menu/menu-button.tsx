import { effect, useContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { TooltipController } from '../tooltip/tooltip-controller';
import { menuContext, type MenuContext } from './menu-context';

declare global {
  interface MaverickElements {
    'media-menu-button': MediaMenuButtonElement;
  }
}

/**
 * A button that controls the opening and closing of a menu component. The button will become a
 * menuitem when used inside a submenu.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @slot - Used to pass in button content.
 * @slot open - Used to display content when menu is open.
 * @slot close - Used to display content when menu is closed.
 * @example
 * ```html
 * <media-menu>
 *   <media-menu-button aria-label="Settings">
 *     <media-icon type="settings"></media-icon>
 *   </media-menu-button>
 *   <media-menu-items>
 *     <!-- ... -->
 *   </media-menu-items>
 * </media-menu>
 * ```
 */
export class MenuButton<T extends MenuButtonAPI = MenuButtonAPI> extends Component<T> {
  static el = defineElement<MenuButtonAPI>({
    tagName: 'media-menu-button',
    props: { disabled: false },
  });

  protected _menu!: MenuContext;

  constructor(instance: ComponentInstance<T>) {
    super(instance);
    new FocusVisibleController(instance);
    new TooltipController(instance);
  }

  protected override onAttach(el: HTMLElement) {
    this._menu = useContext(menuContext);
    this._menu._attachMenuButton(el);
    effect(this._watchDisabled.bind(this));
  }

  protected override onConnect(el: HTMLElement) {
    const hint = Array.from(el.querySelectorAll('[slot="hint"]')).pop();
    if (hint) effect(() => void (hint.textContent = this._menu._hint()));
  }

  protected _watchDisabled() {
    this._menu._disableMenuButton(this.$props.disabled());
  }
}

export interface MenuButtonAPI {
  props: MenuButtonProps;
}

export interface MenuButtonProps {
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
}

export interface MediaMenuButtonElement extends HTMLCustomElement<MenuButton> {}
