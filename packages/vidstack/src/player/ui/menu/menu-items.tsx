import { useContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { menuContext, type MenuContext } from './menu-context';

declare global {
  interface MaverickElements {
    'media-menu-items': MediaMenuItemsElement;
  }
}

/**
 * Menu items can be used to display settings or arbitrary content in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 * @slot - Used to pass in content such as submenus or radio groups.
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
export class MenuItems<T extends MenuItemsAPI = MenuItemsAPI> extends Component<T> {
  static el = defineElement<MenuItemsAPI>({
    tagName: 'media-menu-items',
  });

  protected _menu!: MenuContext;

  constructor(instance: ComponentInstance<T>) {
    super(instance);
    new FocusVisibleController(instance);
  }

  protected override onAttach(el: HTMLElement) {
    this._menu = useContext(menuContext);
    this._menu._attachMenuItems(el);
  }
}

export interface MenuItemsAPI {}

export interface MediaMenuItemsElement extends HTMLCustomElement<MenuItems> {}
