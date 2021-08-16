import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../../base/elements';
import { FullscreenController } from '../../base/fullscreen';
import { LogLevelName } from '../../base/logger';
import { ScreenOrientationController } from '../../base/screen-orientation';
import { Constructor } from '../../global/helpers';
import { getSlottedChildren } from '../../utils/dom';
import { isNil, isUndefined } from '../../utils/unit';
import { MediaController } from '../controller';
import { MediaProviderElement } from '../provider';
import { ControlsManager } from './controls';
import { IdleManager } from './idle';
import { basePlayerStyles } from './styles';

/**
 * Fired when the media player connects to the DOM.
 *
 * @example
 * ```ts
 * import { AudioElement, MediaPlayerConnectEvent } from '@vidstack/elements';
 *
 * function eventHandler(event: MediaPlayerConnectEvent<AudioElement>) {
 *   const { element, onDisconnect } = event.detail;
 *
 *   onDisconnect(() => {
 *     // ...
 *   });
 * }
 * ```
 */
export type MediaPlayerConnectEvent<
  Provider extends MediaProviderElement = MediaProviderElement
> = DiscoveryEvent<Provider>;

export function WithMediaPlayer<T extends Constructor<LitElement>>(
  Provider: T
): T & Constructor<BaseMediaPlayer> {
  class MediaPlayer extends Provider {
    static get styles(): CSSResultGroup {
      return [basePlayerStyles];
    }

    readonly controller = new MediaController(this);

    override connectedCallback() {
      super.connectedCallback();
      new ElementDiscoveryController(this, 'vds-media-player-connect');
    }

    // -------------------------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------------------------

    @property({ attribute: 'log-level' })
    get logLevel(): LogLevelName {
      return this.controller.logLevel;
    }

    set logLevel(newLevel: LogLevelName) {
      this.controller.logLevel = newLevel;
    }

    // -------------------------------------------------------------------------------------------
    // Controls
    // -------------------------------------------------------------------------------------------

    readonly controlsManager = new ControlsManager(this);

    readonly idleManager = new IdleManager(this);

    @property({ attribute: 'custom-controls', type: Boolean, reflect: true })
    get customControls() {
      return !this.controlsManager.isHidden;
    }

    set customControls(isShowing) {
      if (isShowing) {
        this.controlsManager.show();
      } else {
        this.controlsManager.hide();
      }
    }

    @property({ attribute: 'idle-timeout', type: Number })
    get idleTimeout() {
      return this.idleManager.timeout;
    }

    set idleTimeout(timeout) {
      this.idleManager.timeout = timeout;
    }

    // -------------------------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------------------------

    protected override render(): TemplateResult {
      return this.renderPlayer();
    }

    renderPlayer(): TemplateResult {
      return html`${this.renderProvider()}${this.renderUi()}`;
    }

    renderProvider(): TemplateResult {
      return this._renderMediaSlot();
    }

    renderUi(): TemplateResult {
      return html`<slot name="ui"></slot>`;
    }

    // -------------------------------------------------------------------------------------------
    // Media Slot
    // -------------------------------------------------------------------------------------------

    /**
     * This slot is not required for the player to work. It only introduces support for
     * additional players in the ecosystem to plug in and work with this player.
     */
    protected _renderMediaSlot(): TemplateResult {
      return html`
        <slot name="media" @slotchange="${this._handleMediaSlotChange}"></slot>
      `;
    }

    protected _handleMediaSlotChange() {
      // This is a media provider.
      if (!isUndefined((this as any).play)) return;

      const mediaProvider = getSlottedChildren(
        this,
        'media'
      )[0] as MediaProviderElement;

      // Not a bulletproof check, but it's a good enough safety-check to warn devs if they pass the
      // wrong element.
      if (!isNil(mediaProvider) && isUndefined(mediaProvider.play)) {
        throw Error('Invalid media element given to `media` slot.');
      }

      this.controller.setMediaProvider(mediaProvider);
    }

    // -------------------------------------------------------------------------------------------
    // Fullscreen
    // -------------------------------------------------------------------------------------------

    readonly fullscreenController = new FullscreenController(
      this,
      new ScreenOrientationController(this)
    );

    override async requestFullscreen(): Promise<void> {
      if (this._shouldFullscreenMediaProvider()) {
        return this.controller.mediaProvider?.requestFullscreen();
      }

      if (this.fullscreenController.isRequestingNativeFullscreen) {
        return super.requestFullscreen();
      }

      return this.fullscreenController.requestFullscreen();
    }

    async exitFullscreen(): Promise<void> {
      if (this._shouldFullscreenMediaProvider()) {
        // Fallback to document exiting fullscreen incase unknown media provider is used.
        return (
          this.controller.mediaProvider?.exitFullscreen?.() ??
          document.exitFullscreen?.()
        );
      }

      return this.fullscreenController.exitFullscreen();
    }

    /**
     * Whether to fallback to attempting fullscreen directly on the media provider if the native
     * Fullscreen API is not available. For example, on iOS Safari this will handle managing
     * fullscreen via the Safari presentation API (see `VideoPresentationController.ts`).
     */
    protected _shouldFullscreenMediaProvider(): boolean {
      return (
        !this.fullscreenController.isSupportedNatively &&
        !isNil(this.controller.mediaProvider)
      );
    }
  }

  return MediaPlayer;
}

export interface BaseMediaPlayer {
  readonly controller: MediaController;
  readonly controlsManager: ControlsManager;
  readonly idleManager: IdleManager;

  /**
   * Indicates whether a custom user interface should be shown for controlling the resource. If
   * `true`, it is expected that `controls` is set to `false` (the default) to avoid double
   * controls. The `controls` property refers to native controls.
   *
   * @default false
   */
  customControls: boolean;

  /**
   * Sets the default log level throughout the player. Valid values in order of
   * level include `silent`, `error`, `warn`, `info` and `debug`.
   *
   * @default `silent`
   */
  logLevel: LogLevelName;

  /**
   * The amount of time in `ms` to pass before considering the user to be idle (not active).
   *
   * @default 3000
   */
  idleTimeout: number;

  // Fullscreen
  readonly fullscreenController: FullscreenController;
  requestFullscreen(): Promise<void>;
  exitFullscreen(): Promise<void>;

  // Render
  renderPlayer(): TemplateResult;
  renderProvider(): TemplateResult;
  renderUi(): TemplateResult;
}
