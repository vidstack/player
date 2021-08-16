import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../../base/elements';
import { FullscreenController } from '../../base/fullscreen';
import { LogLevelName } from '../../base/logger';
import { ScreenOrientationController } from '../../base/screen-orientation';
import { MediaController } from './MediaController';
import { mediaControllerStyles } from './styles';

export const MEDIA_CONTROLLER_ELEMENT_TAG_NAME = 'vds-media-controller';

/**
 * Fired when the media controller connects to the DOM.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MediaControllerConnectEvent =
  DiscoveryEvent<MediaControllerElement>;

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
 * @slot Used to pass in components that use/manage media state.
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

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  readonly controller = new MediaController(this);

  /**
   * Sets the default log level throughout the player. Valid values in order of
   * level include `silent`, `error`, `warn`, `info` and `debug`.
   *
   * @default `silent`
   */
  @property({ attribute: 'log-level' })
  get logLevel(): LogLevelName {
    return this.controller.logLevel;
  }

  set logLevel(newLevel: LogLevelName) {
    this.controller.logLevel = newLevel;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  override connectedCallback() {
    super.connectedCallback();
    new ElementDiscoveryController(this, 'vds-media-controller-connect');
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  readonly fullscreenController = new FullscreenController(
    this,
    new ScreenOrientationController(this)
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
