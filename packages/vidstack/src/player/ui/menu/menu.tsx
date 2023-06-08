import {
  effect,
  hasProvidedContext,
  onDispose,
  peek,
  provideContext,
  scoped,
  signal,
  tick,
  useContext,
} from 'maverick.js';
import {
  Component,
  defineElement,
  method,
  type ComponentInstance,
  type HTMLCustomElement,
} from 'maverick.js/element';
import {
  ariaBool,
  DOMEvent,
  isKeyboardEvent,
  listenEvent,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import { $ariaBool } from '../../../utils/aria';
import { isElementParent, onPress, setAttributeIfEmpty } from '../../../utils/dom';
import { useMedia, type MediaContext } from '../../core/api/context';
import { menuContext, type MenuContext } from './menu-context';
import { MenuFocusController } from './menu-focus-controller';

declare global {
  interface MaverickElements {
    'media-menu': MediaMenuElement;
  }
}

let idCount = 0;

/**
 * This component is used to display options in a floating panel.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
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
export class Menu extends Component<MenuAPI> {
  static el = defineElement<MenuAPI>({
    tagName: 'media-menu',
    props: { position: null },
  });

  protected _media: MediaContext;

  protected _menuId: string;
  protected _menuButtonId: string;

  protected _expanded = signal(false);
  protected _disabled = signal(false);
  protected _buttonDisabled = signal(false);

  protected _parentMenu?: MenuContext;
  protected _submenus = new Set<MediaMenuElement>();

  protected _menuButton: HTMLElement | null = null;
  protected _menuItems: HTMLElement | null = null;

  protected _focus: MenuFocusController;

  constructor(instance: ComponentInstance<MenuAPI>) {
    super(instance);

    this._media = useMedia();

    const currentIdCount = ++idCount;
    this._menuId = `media-menu-${currentIdCount}`;
    this._menuButtonId = `media-menu-button-${currentIdCount}`;

    if (hasProvidedContext(menuContext)) {
      this._parentMenu = useContext(menuContext);
    }

    this._focus = new MenuFocusController(this.close.bind(this));

    provideContext(menuContext, {
      _expanded: this._expanded,
      _hint: signal(''),
      _disable: this._disable.bind(this),
      _attachMenuButton: this._attachMenuButton.bind(this),
      _attachMenuItems: this._attachMenuItems.bind(this),
      _disableMenuButton: this._disableMenuButton.bind(this),
      _addSubmenu: this._addSubmenu.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    const { position } = this.$props;
    this.setAttributes({
      position,
      'data-open': this._expanded,
      'data-submenu': !!this._parentMenu,
      'data-disabled': this._isDisabled.bind(this),
      'data-media-menu': true,
    });
  }

  protected override onConnect(el: HTMLElement) {
    if (!this._parentMenu) {
      effect(this._watchBreakpoint.bind(this));
    }

    effect(this._watchExpanded.bind(this));

    this._parentMenu?._addSubmenu(el as MediaMenuElement);
    requestAnimationFrame(() => this._onResize());
  }

  protected override onDestroy() {
    this._removePopupMenu();
    this._menuButton = null;
    this._menuItems = null;
  }

  protected _removePopupMenu() {
    if (!this._menuItems || this.el?.contains(this._menuItems)) return;

    const menu = this._menuItems?.parentElement;
    this.el!.append(this._menuItems);

    if (menu?.localName === 'media-menu') {
      (menu as MediaMenuElement).destroy();
      menu.remove();
    }
  }

  protected _watchBreakpoint() {
    if (!this.el) return;

    const { breakpointX, breakpointY, viewType, orientation, fullscreen } = this._media.$store,
      popup = viewType() === 'audio' ? breakpointX() === 'sm' : breakpointY() === 'sm';

    if (!this._menuItems || this._parentMenu) return;

    setAttribute(this.el, 'data-popup', popup);
    setAttribute(this.el, 'data-popup-wide', popup && orientation() === 'landscape');

    if (popup && !fullscreen()) {
      if (this.el.contains?.(this._menuItems)) {
        const menu = this.el!.cloneNode();
        menu.appendChild(this._menuItems);
        scoped(() => {
          document.body.append(menu);
        }, this._media.scope);
      }
    }

    this._onResize();
    return () => this._removePopupMenu();
  }

  protected _watchExpanded() {
    const expanded = this._isExpanded();

    this._onResize();
    this._updateMenuItemsHidden(expanded);

    if (!expanded) return;

    this._focus._listen();

    const closeTarget = this._getCloseTarget();
    if (closeTarget) {
      onPress(closeTarget, this._onCloseTargetPress.bind(this));
    }

    this.listen('pointerup', this._onPointerUp.bind(this));
    listenEvent(window, 'pointerup', this._onWindowPointerUp.bind(this));
  }

  protected _attachMenuButton(el: HTMLElement) {
    const isMenuItem = !!this._parentMenu,
      isExpanded = this._isExpanded.bind(this),
      isARIAExpanded = $ariaBool(isExpanded),
      isARIADisabled = $ariaBool(this._isDisabled.bind(this));

    setAttributeIfEmpty(el, 'tabindex', isMenuItem ? '-1' : '0');
    setAttributeIfEmpty(el, 'role', isMenuItem ? 'menuitem' : 'button');

    setAttribute(el, 'id', this._menuButtonId);
    setAttribute(el, 'aria-controls', this._menuId);
    setAttribute(el, 'aria-haspopup', 'true');

    effect(() => {
      setAttribute(el, 'aria-disabled', isARIADisabled());
      setAttribute(el, 'aria-expanded', isARIAExpanded());
      if (!isMenuItem) setAttribute(el, 'aria-pressed', isARIAExpanded());
      setAttribute(el, 'data-pressed', isExpanded());
    });

    setAttribute(el, 'data-media-button', !isMenuItem);
    setAttribute(el, 'data-media-menu-button', '');

    onPress(el, this._onMenuButtonPress.bind(this));

    this._menuButton = el;
  }

  protected _attachMenuItems(el: HTMLElement) {
    setAttributeIfEmpty(el, 'role', 'menu');
    setAttributeIfEmpty(el, 'tabindex', '-1');
    setAttribute(el, 'id', this._menuId);
    setAttribute(el, 'aria-describedby', this._menuButtonId);
    setAttribute(el, 'data-media-menu-items', '');

    this._menuItems = el;
    this._focus._attach(el);

    this._watchBreakpoint();
    this._updateMenuItemsHidden(peek(this._expanded));
  }

  protected _updateMenuItemsHidden(expanded: boolean) {
    if (this._menuItems) setAttribute(this._menuItems, 'aria-hidden', ariaBool(!expanded));
  }

  protected _disableMenuButton(disabled: boolean) {
    this._buttonDisabled.set(disabled);
  }

  protected _onMenuButtonPress(event: Event) {
    if (this._parentMenu) event.stopPropagation();

    if (this._isDisabled()) return;

    this._expanded.set((expanded) => !expanded);
    this._changeIdleTracking();

    tick();
    if (isKeyboardEvent(event)) this._menuItems?.focus();
    this._onChange(event);
  }

  protected _onChange(trigger?: Event) {
    const expanded = peek(this._expanded);
    this.dispatch(expanded ? 'open' : 'close', { trigger });
    if (!this._parentMenu) {
      if (expanded) {
        this._media.activeMenu?.close(trigger);
        this._media.activeMenu = this;
      } else {
        for (const el of this._submenus) el.close(trigger);
        this._media.activeMenu = null;
      }
    }
  }

  protected _isExpanded() {
    return !this._isDisabled() && this._expanded();
  }

  protected _isDisabled() {
    return this._disabled() || this._buttonDisabled();
  }

  protected _disableBind = this._disable.bind(this);
  protected _disable(disabled: boolean) {
    this._disabled.set(disabled);
  }

  protected _onPointerUp(event: PointerEvent) {
    // Prevent it bubbling up to window so we can determine when to close dialog.
    event.stopPropagation();
  }

  protected _onWindowPointerUp() {
    // A little delay so submenu closing so it doesn't jump size when closing.
    if (this._parentMenu) return setTimeout(this.close.bind(this), 300);
    this.close();
  }

  protected _onCloseTargetPress(event: Event) {
    event.stopPropagation();
    this.close(event);
  }

  protected _getCloseTarget() {
    const target = this.el!.querySelector('[slot="close-target"]');
    return isElementParent(this.el!, target) ? target : null;
  }

  protected _changeIdleTracking(trigger?: Event) {
    if (this._parentMenu) return;
    if (this._expanded()) this._media.remote.pauseUserIdle(trigger);
    else this._media.remote.resumeUserIdle(trigger);
  }

  protected _addSubmenu(el: MediaMenuElement) {
    this._submenus.add(el);
    listenEvent(el, 'open', this._onSubmenuOpenBind);
    listenEvent(el, 'close', this._onSubmenuCloseBind);
    onDispose(this._removeSubmenuBind);
  }

  protected _removeSubmenuBind = this._removeSubmenu.bind(this);
  protected _removeSubmenu(el: MediaMenuElement) {
    this._submenus.delete(el);
  }

  protected _onSubmenuOpenBind = this._onSubmenuOpen.bind(this);
  protected _onSubmenuOpen(event: MenuOpenEvent) {
    for (const el of this._submenus) {
      if (el !== event.target) el.setAttribute('aria-hidden', 'true');
    }

    this._onResize();
  }

  protected _onSubmenuCloseBind = this._onSubmenuClose.bind(this);
  protected _onSubmenuClose() {
    for (const el of this._submenus) el.removeAttribute('aria-hidden');
    this._onResize();
  }

  protected _onResize() {
    if (!this._menuItems || __SERVER__) return;

    let style = getComputedStyle(this._menuItems),
      height = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

    let children = [...this._menuItems.children];
    if (children[0]?.localName === 'shadow-root') {
      children.push(...children[0].children);
    }

    for (const child of children) {
      height += (child as HTMLElement).offsetHeight;
    }

    requestAnimationFrame(() => {
      if (!this._menuItems) return;
      setAttribute(this._menuItems, 'data-resizing', '');
      setTimeout(() => {
        if (!this._menuItems) return;
        setAttribute(this._menuItems, 'data-resizing', false);
      }, 250);
      setStyle(this._menuItems, '--menu-height', height + 'px');
    });
  }

  /**
   * Open this menu. The first menu item will be focused if a `KeyboardEvent` trigger is provided
   */
  @method
  open(trigger?: Event) {
    this._expanded.set(true);
    tick();
    this._onChange(trigger);
    if (isKeyboardEvent(trigger)) this._menuItems?.focus();
    this._changeIdleTracking(trigger);
  }

  /**
   * Close this menu. The menu button that controls this menu will be focused if a `KeyboardEvent`
   * trigger is provided
   */
  @method
  close(trigger?: Event) {
    this._expanded.set(false);
    tick();

    if (isKeyboardEvent(trigger)) {
      requestAnimationFrame(() => {
        this._menuButton?.focus();
      });
    }

    this._onChange(trigger);
    this._changeIdleTracking(trigger);
  }
}

export interface MenuAPI {
  props: MenuProps;
  events: MenuEvents;
}

export type MenuXPosition = 'left' | 'right';
export type MenuYPosition = 'top' | 'bottom';
export type MenuPosition = MenuYPosition | `${MenuYPosition} ${MenuXPosition}`;

export interface MenuProps {
  /**
   * Specifies the position at which the main menu items are opened.
   *
   * @example `top left`
   */
  position: MenuPosition | null;
}

export interface MenuEvents {
  open: MenuOpenEvent;
  close: MenuCloseEvent;
}

/**
 * Fired when the menu is opened.
 */
export interface MenuOpenEvent extends DOMEvent<void> {
  target: MediaMenuElement;
}

/**
 * Fired when the menu is closed.
 */
export interface MenuCloseEvent extends DOMEvent<void> {
  target: MediaMenuElement;
}

export interface MediaMenuElement extends HTMLCustomElement<Menu> {}
