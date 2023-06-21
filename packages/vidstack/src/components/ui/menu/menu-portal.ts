import { Component, computed, createContext, effect, onDispose, provideContext } from 'maverick.js';
import { setStyle } from 'maverick.js/std';

import type { MediaContext } from '../../../core';
import { useMediaContext } from '../../../core/api/media-context';
import { requestScopedAnimationFrame } from '../../../utils/dom';

/**
 * Portals menu items into the document body when the player is at the small vertical breakpoint.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu#portal}
 */
export class MenuPortal extends Component<MenuPortalProps> {
  private _media!: MediaContext;

  private _target: HTMLElement | null = null;
  private _callback?: MenuPortalCallback;
  private _portal = false;

  protected override onSetup(): void {
    this._media = useMediaContext();
    provideContext(menuPortalContext, {
      _attach: this._attachElement.bind(this),
    });
  }

  protected override onDestroy(): void {
    this._putBack();
    this._target = null;
    this._callback = undefined;
  }

  private _attachElement(el: HTMLElement | null, callback?: MenuPortalCallback) {
    this._target = el;
    this._callback = callback;
    if (this._target) {
      callback?.(this._portal);
      onDispose(
        requestScopedAnimationFrame(() => {
          requestScopedAnimationFrame(() => effect(this._watchBreakpoint.bind(this)));
        }),
      );
    }
  }

  private _watchBreakpoint() {
    if (!this._target) return;

    const shouldPortal = this._shouldPortal();

    if (shouldPortal === this._portal) return;

    this._portal = shouldPortal;
    this._callback?.(shouldPortal);

    const isBodyChild = this._target.parentElement === document.body;

    if (shouldPortal) {
      if (!isBodyChild) {
        requestAnimationFrame(() => {
          if (!this._target) return;
          const mediaRing = '--media-focus-ring',
            mediaRingValue = getComputedStyle(this.el!).getPropertyValue(mediaRing);
          if (mediaRingValue) setStyle(this._target, mediaRing, mediaRingValue);
        });

        this._target.remove();
        document.body.append(this._target);
      }
    } else if (isBodyChild) {
      this._putBack();
    }
  }

  private _putBack() {
    if (!this.el || !this._target || this._target.parentElement !== document.body) return;
    this._target.remove();
    this.el.append(this._target);
  }

  private _shouldPortal = computed(() => {
    const { breakpointX, breakpointY, viewType, fullscreen } = this._media.$state;
    return (
      (viewType() === 'audio' ? breakpointX() === 'sm' : breakpointY() === 'sm') && !fullscreen()
    );
  });
}

export interface MenuPortalProps {}

export interface MenuPortalContext {
  _attach(element: HTMLElement | null, callback?: MenuPortalCallback): void;
}

export interface MenuPortalCallback {
  (didPortal: boolean): void;
}

export const menuPortalContext = createContext<MenuPortalContext | null>();
