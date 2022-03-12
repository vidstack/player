import {
  discover,
  DiscoveryEvent,
  FullscreenController,
  ScreenOrientationController,
} from '@vidstack/foundation';
import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { MediaController } from './MediaController.js';
import { mediaControllerStyles } from './styles.js';

/**
 * Fired when the media controller connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaControllerConnectEvent = DiscoveryEvent<MediaControllerElement>;

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components and plugins. The main responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * 💡 The base `MediaPlayer` acts as both a media controller and provider.
 *
 * @tagname vds-media-controller
 * @slot - Used to pass in components that use/manage media state.
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-video-player>
 *     <!-- UI components here. -->
 *   </vds-video-player>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media-controller>
 * ```
 */
export class MediaControllerElement extends LitElement {
  static override get styles(): CSSResultGroup {
    return [mediaControllerStyles];
  }

  constructor() {
    super();
    discover(this, 'vds-media-controller-connect');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  readonly controller = new MediaController(this);

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
}
