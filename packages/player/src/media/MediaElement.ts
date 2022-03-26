import {
  discoverable,
  type DiscoveryEvent,
  FullscreenController,
  IS_IOS,
  ScreenOrientationController,
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
import { state } from 'lit/decorators.js';

import { MediaController } from './controller';
import { mediaStoreSubscription } from './store';
import { bindMediaPropsToAttrs, bindMediaPropsToCssProps } from './style';
import { ViewType } from './ViewType';

/**
 * Fired when `<vds-media>` connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaConnectEvent = DiscoveryEvent<MediaElement>;

/**
 * All media elements exist inside the `<vds-media>` element. It's main jobs are to attach a
 * media controller to a media provider, and expose media state through attributes and
 * CSS properties for styling purposes.
 *
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components and plugins. The main responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * @tagname vds-media
 * @slot - Used to pass in components that use/manage media state.
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
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  readonly controller = new MediaController(this);

  @state() protected __mediaFullscreen = false;
  @state() protected __mediaIsVideoView = false;
  @state() protected __mediaPlaysinline = false;

  get provider() {
    return this.controller.provider;
  }

  constructor() {
    super();

    discoverable(this, 'vds-media-connect');

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
    setAttribute(this, 'media-ui-hidden', this._shouldHideMediaUI());
    super.update(changedProperties);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  readonly fullscreenController = new FullscreenController(
    this,
    new ScreenOrientationController(this),
  );

  override async requestFullscreen(): Promise<void> {
    if (this.fullscreenController.isRequestingNativeFullscreen) {
      return super.requestFullscreen();
    }

    return this.fullscreenController.requestFullscreen();
  }

  async exitFullscreen(): Promise<void> {
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
