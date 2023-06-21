import {
  effect,
  hasProvidedContext,
  onDispose,
  provideContext,
  signal,
  useContext,
} from 'maverick.js';
import { Component } from 'maverick.js';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { autoPlacement } from '../../../utils/dom';
import { menuContext, type MenuContext } from './menu-context';
import { menuPortalContext } from './menu-portal';

/**
 * Menu items can be used to display settings or arbitrary content in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 */
export class MenuItems extends Component<MenuItemsProps> {
  static props: MenuItemsProps = {
    placement: null,
    offset: 0,
    alignOffset: 0,
  };

  protected _menu!: MenuContext;

  private _portal = signal(false);

  constructor() {
    super();

    new FocusVisibleController();

    const { placement } = this.$props;
    this.setAttributes({
      'data-placement': placement,
    });
  }

  protected override onAttach(el: HTMLElement) {
    this._menu = useContext(menuContext);
    this._menu._attachMenuItems(this);

    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        portal._attach(el, this._portal.set);
        onDispose(() => portal._attach(null));
        // Remove portal so submenus don't attach.
        provideContext(menuPortalContext, null);
      }
    }
  }

  protected override onConnect(el: HTMLElement): void {
    effect(this._watchPlacement.bind(this));
  }

  private _watchPlacement() {
    const placement = this.$props.placement();

    if (placement && this.el) {
      if (this._portal()) {
        this.el.removeAttribute('style');
        this.el.style.display = 'none';
        return;
      }

      Object.assign(this.el.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 'max-content',
      });

      const { offset: mainOffset, alignOffset } = this.$props;
      return autoPlacement(this.el, this._getButton(), placement, {
        offsetVarName: 'media-menu',
        xOffset: alignOffset(),
        yOffset: mainOffset(),
      });
    }
  }

  private _getButton() {
    return this._menu._button();
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
