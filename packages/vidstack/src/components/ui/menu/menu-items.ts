import {
  Component,
  effect,
  hasProvidedContext,
  onDispose,
  provideContext,
  useContext,
} from 'maverick.js';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { autoPlacement } from '../../../utils/dom';
import { menuContext, type MenuContext } from './menu-context';
import { menuPortalContext } from './menu-portal';

/**
 * Menu items can be used to display settings or arbitrary content in a floating panel.
 *
 * @attr data-root - Whether this is the root menu items.
 * @attr data-submenu - Whether menu items are part of a submenu.
 * @attr data-open - Whether menu items are currently visible.
 * @attr data-keyboard - Whether the menu is opened via keyboard.
 * @attr data-placement - The placement prop setting.
 * @attr data-focus - Whether item are being keyboard focused.
 * @attr data-hocus - Whether items are being keyboard focused or hovered over.
 * @attr data-transition - Whether the menu is resizing.
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 */
export class MenuItems extends Component<MenuItemsProps> {
  static props: MenuItemsProps = {
    placement: null,
    offset: 0,
    alignOffset: 0,
  };

  #menu!: MenuContext;

  constructor() {
    super();

    new FocusVisibleController();

    const { placement } = this.$props;
    this.setAttributes({
      'data-placement': placement,
    });
  }

  protected override onAttach(el: HTMLElement) {
    this.#menu = useContext(menuContext);
    this.#menu.attachMenuItems(this);
    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        // Remove portal so submenus don't attach.
        provideContext(menuPortalContext, null);
        portal.attach(el);
        onDispose(() => portal.attach(null));
      }
    }
  }

  protected override onConnect(el: HTMLElement): void {
    effect(this.#watchPlacement.bind(this));
  }

  #watchPlacement() {
    const { expanded } = this.#menu;

    if (!this.el || !expanded()) return;

    const placement = this.$props.placement();
    if (!placement) return;

    Object.assign(this.el.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'max-content',
    });

    const { offset: mainOffset, alignOffset } = this.$props;

    onDispose(
      autoPlacement(this.el, this.#getButton(), placement, {
        offsetVarName: 'media-menu',
        xOffset: alignOffset(),
        yOffset: mainOffset(),
      }),
    );

    onDispose(this.#hide.bind(this));
  }

  #hide() {
    if (!this.el) return;
    this.el.removeAttribute('style');
    this.el.style.display = 'none';
  }

  #getButton() {
    return this.#menu.button();
  }
}

export type MenuPlacement = MenuPlacementSide | `${MenuPlacementSide} ${MenuPlacementAlign}`;

export type MenuPlacementSide = 'top' | 'right' | 'bottom' | 'left';
export type MenuPlacementAlign = 'start' | 'center' | 'end';

export interface MenuItemsProps {
  /**
   * A space-separated list which specifies the side and alignment of the menu relative
   * to the menu button.
   *
   * @example `top center`
   * @example `bottom end`
   */
  placement: MenuPlacement | null;
  /**
   * The distance in pixels between the menu items and the menu button. You can also set
   * the CSS variable `--media-menu-y-offset` to adjust this offset.
   */
  offset: number;
  /**
   * The offset in pixels from the start/center/end aligned position. You can also set
   * the CSS variable `--media-menu-x-offset` to adjust this offset.
   */
  alignOffset: number;
}
