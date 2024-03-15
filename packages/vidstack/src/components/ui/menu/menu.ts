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
  animationFrameThrottle,
  ariaBool,
  DOMEvent,
  isKeyboardEvent,
  listenEvent,
  setAttribute,
  setStyle,
} from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import {
  isElementParent,
  isElementVisible,
  isEventInside,
  isHTMLElement,
  onPress,
  setAttributeIfEmpty,
} from '../../../utils/dom';
import { Popper } from '../popper/popper';
import { sliderObserverContext } from '../sliders/slider/slider-context';
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
  private _isSliderActive = false;

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

    this._observeSliders();

    this.setAttributes({
      'data-open': this._expanded,
      'data-submenu': this.isSubmenu,
      'data-disabled': this._isDisabled.bind(this),
    });

    provideContext(menuContext, {
      _button: this._trigger,
      _expanded: this._expanded,
      _hint: signal(''),
      _submenu: !!this._parentMenu,
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
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchExpanded.bind(this));
    if (this.isSubmenu) {
      this._parentMenu?._addSubmenu(this);
    }
  }

  protected override onDestroy() {
    this._trigger.set(null);
    this._content.set(null);
    this._menuObserver = null;
  }

  private _observeSliders() {
    let sliderActiveTimer = -1,
      parentSliderObserver = hasProvidedContext(sliderObserverContext)
        ? useContext(sliderObserverContext)
        : null;

    provideContext(sliderObserverContext, {
      onDragStart: () => {
        parentSliderObserver?.onDragStart?.();
        window.clearTimeout(sliderActiveTimer);
        sliderActiveTimer = -1;
        this._isSliderActive = true;
      },
      onDragEnd: () => {
        parentSliderObserver?.onDragEnd?.();
        sliderActiveTimer = window.setTimeout(() => {
          this._isSliderActive = false;
          sliderActiveTimer = -1;
        }, 300);
      },
    });
  }

  private _watchExpanded() {
    const expanded = this._isExpanded();

    if (!this.isSubmenu) this._onResize();
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

    const watchAttrs = () => setAttribute(el, 'data-open', this._expanded());
    if (__SERVER__) watchAttrs();
    else effect(watchAttrs);

    this._focus._attachMenu(el);
    this._updateMenuItemsHidden(false);

    if (!this.isSubmenu) {
      const onTransition = this._onResizeTransition.bind(this);
      items.listen('transitionstart', onTransition);
      items.listen('transitionend', onTransition);
      items.listen('animationend', this._onResize);
      items.listen('vds-menu-resize' as any, this._onResize);
    }
  }

  private _attachObserver(observer: MenuObserver) {
    this._menuObserver = observer;
  }

  private _updateMenuItemsHidden(expanded: boolean) {
    const content = peek(this._content);
    if (content) setAttribute(content, 'aria-hidden', ariaBool(!expanded));
  }

  private _disableMenuButton(disabled: boolean) {
    this._isTriggerDisabled.set(disabled);
  }

  private _wasKeyboardExpand = false;
  private _onExpandedChange(isExpanded: boolean, event?: Event) {
    this._wasKeyboardExpand = isKeyboardEvent(event);

    event?.stopPropagation();

    if (this._expanded() === isExpanded) return;

    if (this._isDisabled()) {
      if (isExpanded) this._popper.hide(event);
      return;
    }

    this.el?.dispatchEvent(
      new Event('vds-menu-resize', {
        bubbles: true,
        composed: true,
      }),
    );

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

    if (this._wasKeyboardExpand) {
      if (isExpanded) content?.focus();
      else trigger?.focus();

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
        for (const el of this._submenus) el.close(event);
      } else {
        this._media.activeMenu = null;
      }

      this._menuObserver?._onClose?.(event);
    }

    if (isExpanded) {
      requestAnimationFrame(this._updateFocus.bind(this));
    }
  }

  private _updateFocus() {
    if (this._isTransitionActive || this._isSubmenuOpen) return;
    this._focus._update();
    if (this._wasKeyboardExpand) this._focus._focusActive();
    this._focus._scroll();
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
    const content = this._content();

    if (this._isSliderActive || (content && isEventInside(content, event))) {
      return;
    }

    // Prevent it bubbling up to window so we can determine when to close dialog.
    event.stopPropagation();
  }

  private _onWindowPointerUp(event: Event) {
    const content = this._content();

    if (this._isSliderActive || (content && isEventInside(content, event))) {
      return;
    }

    this.close(event);
  }

  private _getCloseTarget() {
    const target = this.el?.querySelector('[data-part="close-target"]');
    return this.el &&
      target &&
      isElementParent(this.el, target, (node) => node.getAttribute('role') === 'menu')
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

  private _isSubmenuOpen = false;
  private _onSubmenuOpenBind = this._onSubmenuOpen.bind(this);
  private _onSubmenuOpen(event: MenuOpenEvent) {
    this._isSubmenuOpen = true;

    const content = this._content();

    if (this.isSubmenu) {
      this.triggerElement?.setAttribute('aria-hidden', 'true');
    }

    for (const target of this._submenus) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute('aria-hidden', 'true');
        }
      }
    }

    if (content) {
      const el = event.target.el;
      for (const child of content.children) {
        if (child.contains(el)) {
          child.setAttribute('data-open', '');
        } else if (child !== el) {
          child.setAttribute('data-hide', '');
        }
      }
    }
  }

  private _onSubmenuCloseBind = this._onSubmenuClose.bind(this);
  private _onSubmenuClose(event: MenuCloseEvent) {
    this._isSubmenuOpen = false;

    const content = this._content();

    if (this.isSubmenu) {
      this.triggerElement?.setAttribute('aria-hidden', 'false');
    }

    for (const target of this._submenus) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute('aria-hidden', 'false');
      }
    }

    if (content) {
      for (const child of content.children) {
        child.removeAttribute('data-open');
        child.removeAttribute('data-hide');
      }
    }
  }

  private _onResize = animationFrameThrottle(() => {
    const content = peek(this._content);
    if (!content || __SERVER__) return;

    let height = 0,
      styles = getComputedStyle(content),
      children = [...content.children];

    for (const prop of ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']) {
      height += parseFloat(styles[prop]) || 0;
    }

    for (const child of children) {
      if (isHTMLElement(child) && child.style.display === 'contents') {
        children.push(...child.children);
      } else if (child.nodeType === 3) {
        height += parseFloat(getComputedStyle(child).fontSize);
      } else if (isHTMLElement(child)) {
        if (!isElementVisible(child)) continue;
        const style = getComputedStyle(child);
        height +=
          child.offsetHeight +
          (parseFloat(style.marginTop) || 0) +
          (parseFloat(style.marginBottom) || 0);
      }
    }

    setStyle(content, '--menu-height', height + 'px');
  });

  protected _isTransitionActive = false;
  protected _onResizeTransition(event: TransitionEvent) {
    const content = this._content();
    if (content && event.propertyName === 'height') {
      this._isTransitionActive = event.type === 'transitionstart';

      setAttribute(content, 'data-resizing', this._isTransitionActive);

      if (this._expanded()) this._updateFocus();
    }
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

export interface MenuEvents
  extends Pick<
    MediaRequestEvents,
    'media-pause-controls-request' | 'media-resume-controls-request'
  > {
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
