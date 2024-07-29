import { Component, createContext, effect, provideContext } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
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

  #target: HTMLElement | null = null;
  #media!: MediaContext;

  protected override onSetup(): void {
    this.#media = useMediaContext();
    provideContext(menuPortalContext, {
      attach: this.#attachElement.bind(this),
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
    this.#target?.remove();
    this.#target = null;
  }

  #attachElement(el: HTMLElement | null) {
    this.#portal(false);
    this.#target = el;
    // Wait two animations frames: first is for connected callback, second is to allow icon
    // slots to be replaced.
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.#watchDisabled.bind(this));
      });
    });
  }

  #watchDisabled() {
    const { fullscreen } = this.#media.$state,
      { disabled } = this.$props;
    this.#portal(disabled() === 'fullscreen' ? !fullscreen() : !disabled());
  }

  #portal(shouldPortal: boolean) {
    if (!this.#target) return;

    let container = this.#getContainer(this.$props.container());
    if (!container) return;

    const isPortalled = this.#target.parentElement === container;
    setAttribute(this.#target, 'data-portal', shouldPortal);

    if (shouldPortal) {
      if (!isPortalled) {
        this.#target.remove();
        container!.append(this.#target);
      }
    } else if (isPortalled && this.#target.parentElement === container) {
      this.#target.remove();
      this.el?.append(this.#target);
    }
  }

  #getContainer(selector: MenuPortalProps['container']) {
    if (isHTMLElement(selector)) return selector;
    return selector ? document.querySelector<HTMLElement>(selector) : document.body;
  }
}

export interface MenuPortalProps {
  /**
   * Specifies a DOM element or query selector for the container that the menu should be portalled
   * inside. Defaults to `document.body` when set to `null`.
   */
  container: string | HTMLElement | null;
  /**
   * Whether the portal should be disabled. The value can be the string "fullscreen" to disable
   * portals while media is fullscreen. This is to ensure the menu remains visible.
   */
  disabled: boolean | 'fullscreen';
}

export interface MenuPortalContext {
  attach(element: HTMLElement | null): void;
}

export const menuPortalContext = createContext<MenuPortalContext | null>();
