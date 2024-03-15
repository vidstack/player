import { Component, createContext, effect, provideContext } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import type { MediaContext } from '../../../core';
import { useMediaContext } from '../../../core/api/media-context';
import { isHTMLElement, requestScopedAnimationFrame } from '../../../utils/dom';

/**
 * Portals menu items into the document body.
 *
 * @attr data-portal - Whether portal is active (determined by `disabled` prop).
 * @docs {@link https://www.vidstack.io/docs/player/components/menu#portal}
 */
export class MenuPortal extends Component<MenuPortalProps> {
  static props: MenuPortalProps = {
    container: null,
    disabled: false,
  };

  private _target: HTMLElement | null = null;
  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();
    provideContext(menuPortalContext, {
      _attach: this._attachElement.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('display', 'contents');
  }

  // Need this so connect scope is defined.
  protected override onConnect(el: HTMLElement): void {
    // no-op
  }

  protected override onDestroy(): void {
    this._target?.remove();
    this._target = null;
  }

  private _attachElement(el: HTMLElement | null) {
    this._portal(false);
    this._target = el;
    // Wait two animations frames: first is for connected callback, second is to allow icon
    // slots to be replaced.
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this._watchDisabled.bind(this));
      });
    });
  }

  private _watchDisabled() {
    const { fullscreen } = this._media.$state,
      { disabled } = this.$props,
      _disabled = disabled();
    this._portal(_disabled === 'fullscreen' ? !fullscreen() : !_disabled);
  }

  private _portal(shouldPortal: boolean) {
    if (!this._target) return;

    let container = this._getContainer(this.$props.container());
    if (!container) return;

    const isPortalled = this._target.parentElement === container;
    setAttribute(this._target, 'data-portal', shouldPortal);

    if (shouldPortal) {
      if (!isPortalled) {
        this._target.remove();
        container!.append(this._target);
      }
    } else if (isPortalled && this._target.parentElement === container) {
      this._target.remove();
      this.el?.append(this._target);
    }
  }

  private _getContainer(selector: MenuPortalProps['container']) {
    if (isHTMLElement(selector)) return selector;
    return selector ? document.querySelector<HTMLElement>(selector) : document.body;
  }
}

export interface MenuPortalProps {
  /**
   * Specifies a DOM element or query selector for the container that the menu should be portalled
   * inside.
   */
  container: HTMLElement | string | null;
  /**
   * Whether the portal should be disabled. The value can be the string "fullscreen" to disable
   * portals while media is fullscreen. This is to ensure the menu remains visible.
   */
  disabled: boolean | 'fullscreen';
}

export interface MenuPortalContext {
  _attach(element: HTMLElement | null): void;
}

export const menuPortalContext = createContext<MenuPortalContext | null>();
