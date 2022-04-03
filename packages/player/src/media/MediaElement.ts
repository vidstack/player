import {
  discoverable,
  type DiscoveryEvent,
  FullscreenController,
  IS_IOS,
  ScreenOrientationController,
  ScreenOrientationLock,
  setAttribute,
} from '@vidstack/foundation';
import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from 'lit';
import { property, state } from 'lit/decorators.js';

import { MediaController } from './controller';
import { mediaStoreSubscription } from './store';
import { bindMediaPropsToAttrs, bindMediaPropsToCssProps } from './style';
import { ViewType } from './ViewType';

export const mediaDiscoveryId = Symbol('@vidstack/media-discovery');

/**
 * Fired when `<vds-media>` connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaConnectEvent = DiscoveryEvent<MediaElement>;

/**
 * All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
 * media controller, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @tagname vds-media
 * @slot - Used to pass in components that use/manage/provide media state.
 * @events ./request.events.ts
 * @example
 * ```html
 * <vds-media>
 *   <vds-video>
 *     <video src="..." />
 *   </vds-video>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media>
 * ```
 */
export class MediaElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [
      css`
        :host {
          display: inline-block;
          position: relative;
          contain: content;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  /**
   * The media controller which is responsible for updating the media store and satisfying media
   * requests.
   */
  readonly controller = new MediaController(this);

  @state() protected __mediaFullscreen = false;
  @state() protected __mediaIsVideoView = false;
  @state() protected __mediaPlaysinline = false;

  /**
   * The media provider element (e.g., `vds-video`) that is attached to the controller.
   */
  get provider() {
    return this.controller.provider;
  }

  constructor() {
    super();

    discoverable(this, 'vds-media-connect', { register: mediaDiscoveryId });

    mediaStoreSubscription(this, 'fullscreen', ($fullscreen) => {
      this.__mediaFullscreen = $fullscreen;
    });
    mediaStoreSubscription(this, 'viewType', ($viewType) => {
      this.__mediaIsVideoView = $viewType === ViewType.Video;
    });
    mediaStoreSubscription(this, 'playsinline', ($playsinline) => {
      this.__mediaPlaysinline = $playsinline;
    });

    this._bindMediaAttributes();
    this._bindMediaCSSProperties();
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    setAttribute(this, 'hide-ui', this._shouldHideMediaUI());
    super.update(changedProperties);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Orientation
  // -------------------------------------------------------------------------------------------

  /**
   * Controls the screen orientation of the current browser window.
   */
  readonly screenOrientationController = new ScreenOrientationController(this);

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  /**
   * Controls the fullscreen state of the current element.
   */
  readonly fullscreenController = new FullscreenController(this, this.screenOrientationController);

  /**
   * Whether the native browser fullscreen API is available. This does not mean that the
   * operation is guaranteed to be successful, only that it can be attempted.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API}
   */
  get canFullscreen(): boolean {
    return this.fullscreenController.isSupported;
  }

  /**
   * Whether the media element is currently in fullscreen mode.
   */
  get fullscreen(): boolean {
    return this.fullscreenController.isFullscreen;
  }

  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   *
   * @defaultValue undefined
   */
  @property({ attribute: 'fullscreen-orientation' })
  get fullscreenOrientation(): ScreenOrientationLock | undefined {
    return this.fullscreenController.screenOrientationLock;
  }

  set fullscreenOrientation(lockType) {
    const prevLockType = this.fullscreenController.screenOrientationLock;
    if (prevLockType !== lockType) {
      this.fullscreenController.screenOrientationLock = lockType;
      this.requestUpdate('fullscreen-orientation', prevLockType);
    }
  }

  /**
   * Attempts to display the element in fullscreen. The promise will resolve if successful, and
   * reject if not.
   */
  enterFullscreen(): Promise<void> {
    return this.fullscreenController.enterFullscreen();
  }

  /**
   * Attempts to display the element inline by exiting fullscreen.
   */
  exitFullscreen(): Promise<void> {
    return this.fullscreenController.exitFullscreen();
  }

  // -------------------------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------------------------

  protected _bindMediaAttributes() {
    bindMediaPropsToAttrs(this, this.controller.store, [
      'autoplay',
      'autoplayError',
      'canLoad',
      'canPlay',
      'canFullscreen',
      'ended',
      'error',
      'fullscreen',
      'userIdle',
      'loop',
      'mediaType',
      'muted',
      'paused',
      'playing',
      'playsinline',
      'seeking',
      'started',
      'viewType',
      'waiting',
    ]);
  }

  protected _bindMediaCSSProperties() {
    bindMediaPropsToCssProps(this, this.controller.store, [
      'bufferedAmount',
      'currentTime',
      'duration',
      'seekableAmount',
    ]);
  }

  protected _shouldHideMediaUI(): boolean {
    return (
      IS_IOS && this.__mediaIsVideoView && (!this.__mediaPlaysinline || this.__mediaFullscreen)
    );
  }
}
