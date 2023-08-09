import { Component, createContext, effect, provideContext } from 'maverick.js';
import { isString, setAttribute } from 'maverick.js/std';
import type { MediaContext } from '../../../core';
import { useMediaContext } from '../../../core/api/media-context';
import { requestScopedAnimationFrame } from '../../../utils/dom';

/**
 * Portals menu items into the document body.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu#portal}
 */
export class MenuPortal extends Component<MenuPortalProps> {
  static props: MenuPortalProps = {
    disabled: false,
    container: null,
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
    el.style.display = 'contents';
  }

  protected override onDestroy(): void {
    this._target?.remove();
    this._target = null;
  }

  private _attachElement(el: HTMLElement | null) {
    this._portal(false);
    this._target = el;
    requestScopedAnimationFrame(() => {
      effect(this._watchDisabled.bind(this));
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

    const selector = this.$props.container();

    let container = isString(selector)
      ? document.querySelector<HTMLElement>(`body > ${selector}`)
      : document.body;

    if (!container && selector) {
      container = document.createElement('div');
      container.style.display = 'contents';
      if (selector.startsWith('.')) container.classList.add(selector.slice(1));
      document.body.append(container);
    }

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
}

export interface MenuPortalProps {
  /**
   * Specifies the selector query for the container element that the menu should be portalled
   * inside. Must be an immediate child of body. If the element doesn't exist it will be
   * created to match the selector.
   *
   * For example, given the container name `.video-ui` the portal will be:
   *
   * ```html
   * <body>
   *   <div class="video-ui">
   *     <div role="menu">
   *       <!-- ... -->
   *     </div>
   *   </div>
   * </body>
   * ```
   */
  container: string | null;
  /**
   * Whether the portal should be disabled. The value 'fullscreen' will remove the portal
   * and place the element in it's original DOM position during fullscreen.
   */
  disabled: boolean | 'fullscreen';
}

export interface MenuPortalContext {
  _attach(element: HTMLElement | null): void;
}

export const menuPortalContext = createContext<MenuPortalContext | null>();
