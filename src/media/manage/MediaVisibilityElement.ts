import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { DisposalBin, eventListener, vdsEvent } from '../../base/events';
import { IntersectionController, PageController } from '../../base/observers';
import type { MediaProviderElement } from '../provider';

export type EnterVisibilityMediaAction = 'play' | 'unmute';
export type ExitVisibilityMediaAction = 'pause' | 'mute';

/**
 * This element is responsible for managing a `MediaProviderElement` as viewport or page
 * visibility changes occur.
 *
 * Management includes:
 *
 * - Playback or volume changes when page visibility changes (eg: user changes tab or device
 * sleeps).
 *
 * - Playback or volume changes when viewport visibility changes (eg: user scrolls video in and
 * out of view).
 *
 * @tagname vds-media-visibility
 * @slot - Used to pass in content, typically a media player/provider.
 * @events './media-visibility.events.ts'
 * @example
 * ```html
 * <vds-media-visibility
 *   enter-viewport="play"
 *   exit-viewport="pause"
 *   enter-page="unmute"
 *   exit-page="mute"
 * >
 *   <!-- ... -->
 * </vds-media-visibility>
 * ```
 */
export class MediaVisibilityElement extends LitElement {
  /**
   * The action to perform on the media provider when it enters the viewport.
   *
   * @default undefined
   */
  @property({ attribute: 'enter-viewport' })
  enterViewport?: EnterVisibilityMediaAction;

  /**
   * The action to perform on the media provider when it exits the viewport.
   *
   * @default undefined
   */
  @property({ attribute: 'exit-viewport' })
  exitViewport?: ExitVisibilityMediaAction;

  /**
   * The amount of time in milliseconds to delay viewport enter actions.
   *
   * @default 0
   */
  @property({ type: Number, attribute: 'viewport-enter-delay' })
  viewportEnterDelay = 0;

  /**
   * The action to perform on the media provider when the page becomes visible.
   *
   * @default undefined
   */
  @property({ attribute: 'enter-page' })
  enterPage?: EnterVisibilityMediaAction;

  /**
   * The action to perform on the media provider when the page becomes hidden.
   *
   * @default undefined
   */
  @property({ attribute: 'exit-page' })
  exitPage?: ExitVisibilityMediaAction;

  /**
   * The type of page state to use when determining visibility.
   *
   * - **state:** Refers to the page lifecycle state. This is typically what you want.
   * - **visibility:** Visible here means the page content may be at least partially visible. In
   * practice, this means that the page is the foreground tab of a non-minimized window.
   *
   *💡 Need help making a decision?
   *
   * - Use `state` when you want completely visible / not visible.
   * - Use `visibility` when you want partially visible / not visible.
   *
   * @default 'state'
   */
  @property({ attribute: 'page-change-type' })
  pageChangeType: 'state' | 'visibility' = 'state';

  /**
   * The amount of time in milliseconds to delay page enter actions.
   *
   * @default 0
   */
  @property({ type: Number, attribute: 'page-enter-delay' })
  pageEnterDelay = 0;

  /**
   * A DOM query selector for the element that is used as the viewport for checking visibility
   * of the media player. Must be a ancestor of the media player. Defaults to the browser viewport
   * if not specified.
   *
   * @default undefined
   */
  @property({ attribute: 'intersection-root' })
  intersectionRoot?: string;

  /**
   * A number which indicates at what percentage of the media player's visibility the observer's
   * `onEnter` and `onExit` actions should be triggered.
   *
   * @default 1
   */
  @property({ type: Number, attribute: 'intersection-threshold' })
  intersectionThreshold = 1;

  // -------------------------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------------------------

  protected _isIntersecting = false;

  get isIntersecting() {
    return this._isIntersecting;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hasIntersected = false;
    this._mediaProviderDisposal.empty();
  }

  override render() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider Connect
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider?: MediaProviderElement;
  protected _mediaProviderDisposal = new DisposalBin();

  get mediaProvider() {
    return this._mediaProvider;
  }

  protected _handleMediaProviderConnect = eventListener(
    this,
    'vds-media-provider-connect',
    (event) => {
      const { element, onDisconnect } = event.detail;

      this._mediaProvider = element;

      this._mediaProviderDisposal.add(() => {
        this._mediaProvider = undefined;
      });

      onDisconnect(() => {
        this._mediaProviderDisposal.empty();
      });
    }
  );

  // -------------------------------------------------------------------------------------------
  // Observers
  // -------------------------------------------------------------------------------------------

  protected _hasIntersected = false;
  protected _intersectionTimeout?: any;
  protected intersectionController = new IntersectionController(
    this,
    {
      root: this.intersectionRoot
        ? document.querySelector(this.intersectionRoot)
        : null,
      threshold: this.intersectionThreshold
    },
    (entries) => {
      window.clearTimeout(this._intersectionTimeout);

      const entry = entries[0];

      this._isIntersecting = entry.isIntersecting;

      // Skip first, we only want as we enter/exit viewport (not initial load).
      if (this._hasIntersected) {
        if (entry.isIntersecting) {
          this._intersectionTimeout = window.setTimeout(() => {
            this._triggerOnEnter(this.enterViewport);
            this._intersectionTimeout = undefined;
          }, this.viewportEnterDelay);
        } else if (this.exitViewport) {
          this._isIntersecting = false;
          this._triggerOnExit(this.exitViewport);
        }
      }

      this._hasIntersected = true;
      this._dispatchVisibilityChange();
    }
  );

  protected _pageTimeout?: any;
  protected pageController = new PageController(
    this,
    ({ state, visibility }) => {
      window.clearTimeout(this._pageTimeout);

      if (!this.isIntersecting) return;

      const newState = this.pageChangeType === 'state' ? state : visibility;

      if (newState === 'hidden') {
        this._triggerOnExit(this.exitPage);
      } else if (this.enterViewport) {
        this._pageTimeout = window.setTimeout(() => {
          this._triggerOnEnter(this.enterPage);
          this._pageTimeout = undefined;
        }, this.pageEnterDelay);
      }

      this._dispatchVisibilityChange();
    }
  );

  // -------------------------------------------------------------------------------------------
  // Triggers
  // -------------------------------------------------------------------------------------------

  protected _triggerOnEnter(mediaAction?: EnterVisibilityMediaAction) {
    if (!this._mediaProvider) return;

    if (mediaAction === 'play') {
      this._mediaProvider.paused = false;
    } else if (mediaAction === 'unmute') {
      this._mediaProvider.muted = false;
    }
  }

  protected _triggerOnExit(mediaAction?: ExitVisibilityMediaAction) {
    if (!this._mediaProvider) return;

    if (mediaAction === 'pause') {
      this._mediaProvider.paused = true;
    } else if (mediaAction === 'mute') {
      this._mediaProvider.muted = true;
    }
  }

  protected _dispatchVisibilityChange() {
    if (!this._mediaProvider) return;

    this.dispatchEvent(
      vdsEvent('vds-media-visibility-change', {
        bubbles: true,
        composed: true,
        detail: {
          provider: this._mediaProvider,
          viewport: {
            isIntersecting: this.isIntersecting
          },
          page: {
            state: this.pageController.state,
            visibility: this.pageController.visibility
          }
        }
      })
    );
  }
}
