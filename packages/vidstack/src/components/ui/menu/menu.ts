import {
  Component,
  effect,
  hasProvidedContext,
  method,
  onDispose,
  peek,
  prop,
  provideContext,
  signal,
  tick,
  useContext,
} from 'maverick.js';
import {
  ariaBool,
  DOMEvent,
  isKeyboardEvent,
  listenEvent,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { $ariaBool } from '../../../utils/aria';
import { isElementParent, onPress, setAttributeIfEmpty } from '../../../utils/dom';
import { Popper } from '../popper/popper';
import type { MenuButton } from './menu-button';
import { menuContext, type MenuContext, type MenuObserver } from './menu-context';
import { MenuFocusController } from './menu-focus-controller';
import type { MenuItems } from './menu-items';

let idCount = 0;

/**
 * Root menu container used to hold and manage a menu button and menu items. This component is
 * used to display options in a floating panel. They can be nested to create submenus.
 *
 * @attr data-open - Whether menu is open.
 * @attr data-keyboard - Whether the menu is opened via keyboard.
 * @attr data-submenu - Whether menu is a submenu.
 * @attr data-disabled - Whether menu is disabled.
 * @attr data-resizing - Whether the menu is resizing.
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/menu}
 */
export class Menu extends Component<MenuProps, {}, MenuEvents> {
  static props: MenuProps = {
    showDelay: 0,
  };

  private _media!: MediaContext;

  private _menuId!: string;
  private _menuButtonId!: string;

  private _expanded = signal(false);
  private _disabled = signal(false);

  private _trigger = signal<HTMLElement | null>(null);
  private _content = signal<HTMLElement | null>(null);
  private _isTriggerDisabled = signal(false);

  private _parentMenu?: MenuContext;
  private _submenus = new Set<Menu>();
  private _menuObserver: MenuObserver | null = null;

  private _popper: Popper;
  private _focus!: MenuFocusController;

  /**
   * The menu trigger element.
   */
  @prop
  get triggerElement() {
    return this._trigger();
  }

  /**
   * The menu items element.
   */
  @prop
  get contentElement() {
    return this._content();
  }

  /**
   * Whether this menu is the child of another menu that contains it.
   */
  @prop
  get isSubmenu() {
    return !!this._parentMenu;
  }

  constructor() {
    super();

    const { showDelay } = this.$props;
    this._popper = new Popper({
      _trigger: this._trigger,
      _content: this._content,
      _showDelay: showDelay,
      _listen: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this._expanded()) hide(event);
          else show(event);
        });

        const closeTarget = this._getCloseTarget();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      _onChange: this._onExpandedChange.bind(this),
    });
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    const currentIdCount = ++idCount;
    this._menuId = `media-menu-${currentIdCount}`;
    this._menuButtonId = `media-menu-button-${currentIdCount}`;

    this._focus = new MenuFocusController({
      _getScrollContainer: this._findScrollContainer.bind(this),
      _closeMenu: this.close.bind(this),
    });

    if (hasProvidedContext(menuContext)) {
      this._parentMenu = useContext(menuContext);
    }

    this.setAttributes({
      'data-open': this._expanded,
      'data-submenu': this.isSubmenu,
      'data-disabled': this._isDisabled.bind(this),
    });

    provideContext(menuContext, {
      _button: this._trigger,
      _expanded: this._expanded,
      _hint: signal(''),
      _disable: this._disable.bind(this),
      _attachMenuButton: this._attachMenuButton.bind(this),
      _attachMenuItems: this._attachMenuItems.bind(this),
      _attachObserver: this._attachObserver.bind(this),
      _disableMenuButton: this._disableMenuButton.bind(this),
      _addSubmenu: this._addSubmenu.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement) {
    el.style.setProperty('display', 'contents');
    this._focus._attachMenu(el);
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchExpanded.bind(this));
    if (this.isSubmenu) this._parentMenu?._addSubmenu(this);
    requestAnimationFrame(() => {
      this._onResize();
    });
  }

  protected override onDestroy() {
    this._trigger.set(null);
    this._content.set(null);
    this._menuObserver = null;
  }

  private _watchExpanded() {
    const expanded = this._isExpanded();

    this._onResize();
    this._updateMenuItemsHidden(expanded);

    if (!expanded) return;

    effect(() => {
      const { height } = this._media.$state,
        content = this._content();
      content && setStyle(content, '--player-height', height() + 'px');
    });

    this._focus._listen();

    this.listen('pointerup', this._onPointerUp.bind(this));
    listenEvent(window, 'pointerup', this._onWindowPointerUp.bind(this));
  }

  private _attachMenuButton(button: MenuButton) {
    const el = button.el!,
      isMenuItem = this.isSubmenu,
      isARIADisabled = $ariaBool(this._isDisabled.bind(this));

    setAttributeIfEmpty(el, 'tabindex', isMenuItem ? '-1' : '0');
    setAttributeIfEmpty(el, 'role', isMenuItem ? 'menuitem' : 'button');

    setAttribute(el, 'id', this._menuButtonId);
    setAttribute(el, 'aria-haspopup', 'menu');
    setAttribute(el, 'aria-expanded', 'false');
    setAttribute(el, 'data-submenu', this.isSubmenu);

    if (!this.isSubmenu) {
      this._stopClickPropagation(el);
    }

    const watchAttrs = () => {
      setAttribute(el, 'data-open', this._expanded());
      setAttribute(el, 'aria-disabled', isARIADisabled());
    };

    if (__SERVER__) watchAttrs();
    else effect(watchAttrs);

    this._trigger.set(el);
    onDispose(() => {
      this._trigger.set(null);
    });
  }

  private _attachMenuItems(items: MenuItems) {
    const el = items.el!;
    el.style.setProperty('display', 'none');

    setAttribute(el, 'id', this._menuId);
    setAttributeIfEmpty(el, 'role', 'menu');
    setAttributeIfEmpty(el, 'tabindex', '-1');
    setAttribute(el, 'data-submenu', this.isSubmenu);

    this._content.set(el);
    onDispose(() => this._content.set(null));

    if (!this.isSubmenu) {
      this._stopClickPropagation(el);
    }

    const watchAttrs = () => {
      setAttribute(el, 'data-open', this._expanded());
    };

    if (__SERVER__) watchAttrs();
    else effect(watchAttrs);

    this._focus._attachMenu(el);
    this._updateMenuItemsHidden(false);

    if (!__SERVER__) {
      requestAnimationFrame(this._onResize.bind(this));
    }
  }

  private _attachObserver(observer: MenuObserver) {
    this._menuObserver = observer;
  }

  private _stopClickPropagation(el: HTMLElement) {
    listenEvent(el, 'click', (e) => e.stopPropagation());
    listenEvent(el, 'pointerup', (e) => e.stopPropagation());
  }

  private _updateMenuItemsHidden(expanded: boolean) {
    const content = peek(this._content);
    if (content) setAttribute(content, 'aria-hidden', ariaBool(!expanded));
  }

  private _disableMenuButton(disabled: boolean) {
    this._isTriggerDisabled.set(disabled);
  }

  private _onExpandedChange(isExpanded: boolean, event?: Event) {
    event?.stopPropagation();

    if (this._expanded() === isExpanded) return;

    if (this._isDisabled()) {
      if (isExpanded) this._popper.hide(event);
      return;
    }

    const trigger = this._trigger(),
      content = this._content();

    if (trigger) {
      setAttribute(trigger, 'aria-controls', isExpanded && this._menuId);
      setAttribute(trigger, 'aria-expanded', ariaBool(isExpanded));
    }

    if (content) setAttribute(content, 'aria-labelledby', isExpanded && this._menuButtonId);

    this._expanded.set(isExpanded);
    this._toggleMediaControls(event);
    tick();

    if (isKeyboardEvent(event)) {
      if (isExpanded) {
        content?.focus();
      } else {
        trigger?.focus();
      }

      for (const el of [this.el, content]) {
        el && el.setAttribute('data-keyboard', '');
      }
    } else {
      for (const el of [this.el, content]) {
        el && el.removeAttribute('data-keyboard');
      }
    }

    this.dispatch(isExpanded ? 'open' : 'close', { trigger: event });

    if (isExpanded) {
      if (!this.isSubmenu && this._media.activeMenu !== this) {
        this._media.activeMenu?.close(event);
        this._media.activeMenu = this;
      }

      this._menuObserver?._onOpen?.(event);
    } else {
      if (this.isSubmenu) {
        // A little delay so submenu closing doesn't jump menu size when closing.
        setTimeout(() => {
          for (const el of this._submenus) el.close(event);
        }, 300);
      } else {
        this._media.activeMenu = null;
      }

      this._menuObserver?._onClose?.(event);
    }

    if (isExpanded && !isKeyboardEvent(event)) {
      requestAnimationFrame(() => {
        this._focus._update();
        // Timeout to allow size to be updated via transition.
        setTimeout(() => {
          this._focus._scroll();
        }, 100);
      });
    }
  }

  private _isExpanded() {
    return !this._isDisabled() && this._expanded();
  }

  private _isDisabled() {
    return this._disabled() || this._isTriggerDisabled();
  }

  private _disable(disabled: boolean) {
    this._disabled.set(disabled);
  }

  private _onPointerUp(event: PointerEvent) {
    // Prevent it bubbling up to window so we can determine when to close dialog.
    event.stopPropagation();
  }

  private _onWindowPointerUp(event: Event) {
    // A little delay so submenu closing doesn't jump menu size when closing.
    if (this.isSubmenu) return setTimeout(this.close.bind(this, event), 800);
    else this.close(event);
  }

  private _getCloseTarget() {
    const target = this.el!.querySelector('[data-part="close-target"]');
    return isElementParent(this.el!, target, (node) => node.getAttribute('role') === 'menu')
      ? target
      : null;
  }

  private _findScrollContainer() {
    if (!this.isSubmenu) {
      const content = peek(this._content);
      return content || null;
    } else {
      let el: HTMLElement | null = this.el;

      while (el && el.tagName !== 'media-menu' && el.hasAttribute('data-submenu')) {
        el = el.parentNode as HTMLElement;
      }

      return el;
    }
  }

  private _toggleMediaControls(trigger?: Event) {
    if (this.isSubmenu) return;
    if (this._expanded()) this._media.remote.pauseControls(trigger);
    else this._media.remote.resumeControls(trigger);
  }

  private _addSubmenu(menu: Menu) {
    this._submenus.add(menu);
    listenEvent(menu, 'open', this._onSubmenuOpenBind);
    listenEvent(menu, 'close', this._onSubmenuCloseBind);
    onDispose(this._removeSubmenuBind);
  }

  private _removeSubmenuBind = this._removeSubmenu.bind(this);
  private _removeSubmenu(menu: Menu) {
    this._submenus.delete(menu);
  }

  private _onSubmenuOpenBind = this._onSubmenuOpen.bind(this);
  private _onSubmenuOpen(event: MenuOpenEvent) {
    for (const target of this._submenus) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute('aria-hidden', 'true');
        }
      }
    }

    requestAnimationFrame(() => {
      this._onResize();
    });
  }

  private _onSubmenuCloseBind = this._onSubmenuClose.bind(this);
  private _onSubmenuClose() {
    for (const target of this._submenus) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute('aria-hidden', 'false');
      }
    }

    requestAnimationFrame(() => {
      this._onResize();
    });
  }

  private _onResize() {
    const content = peek(this._content);

    if (!content || __SERVER__) return;

    let { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } =
        getComputedStyle(content),
      height =
        parseFloat(paddingTop) +
        parseFloat(paddingBottom) +
        parseFloat(borderTopWidth) +
        parseFloat(borderBottomWidth),
      children = [...content.children];

    for (const child of children) {
      if (child instanceof HTMLElement && child.style.display === 'contents') {
        children.push(...child.children);
      } else if (child.nodeType === 3) {
        height += parseInt(window.getComputedStyle(child).fontSize, 10);
      } else {
        height += (child as HTMLElement).offsetHeight || 0;
      }
    }

    requestAnimationFrame(() => {
      if (!content) return;

      setAttribute(content, 'data-resizing', '');

      setTimeout(() => {
        if (content) setAttribute(content, 'data-resizing', false);
      }, 400);

      setStyle(content, '--menu-height', height + 'px');
    });
  }

  /**
   * Open this menu. The first menu item will be focused if a `KeyboardEvent` trigger is provided
   */
  @method
  open(trigger?: Event) {
    if (peek(this._expanded)) return;
    this._popper.show(trigger);
    tick();
  }

  /**
   * Close this menu. The menu button that controls this menu will be focused if a `KeyboardEvent`
   * trigger is provided
   */
  @method
  close(trigger?: Event) {
    if (!peek(this._expanded)) return;
    this._popper.hide(trigger);
    tick();
  }
}

export interface MenuProps {
  /**
   * The amount of time in milliseconds to wait before showing the menu.
   */
  showDelay: number;
}

export interface MenuEvents {
  open: MenuOpenEvent;
  close: MenuCloseEvent;
}

/**
 * Fired when the menu is opened.
 */
export interface MenuOpenEvent extends DOMEvent<void> {
  target: Menu;
}

/**
 * Fired when the menu is closed.
 */
export interface MenuCloseEvent extends DOMEvent<void> {
  target: Menu;
}
