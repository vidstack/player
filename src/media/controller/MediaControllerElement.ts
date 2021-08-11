import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { ExtractContextRecordTypes } from '../../base/context';
import { discover, DiscoveryEvent } from '../../base/elements';
import { DisposalBin, eventListener, listen } from '../../base/events';
import {
  ElementLogger,
  logLevel,
  LogLevelName,
  LogLevelNameMap
} from '../../base/logger';
import { DEV_MODE } from '../../env';
import { isNil } from '../../utils/unit';
import {
  MediaContainerConnectEvent,
  MediaContainerElement
} from '../container';
import { cloneMediaContextRecord, mediaContext } from '../context';
import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from '../request.events';
import { ControlsManager } from './controls';
import { IdleManager } from './idle';
import { mediaControllerStyles } from './styles';
import { WithMediaProviderBridge } from './WithMediaProviderBridge';

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
 * components, such as UI components. The main responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * - Act as a proxy for the connected media provider element. As a proxy it will forward
 * attributes, properties, methods and events to/from the provider.
 *
 * @tagname vds-media-controller
 * @slot Used to pass in components that use/manage media state.
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *     >
 *       <!-- ... -->
 *     </vds-video>
 *
 *     <!-- UI components here. -->
 *   </vds-media-container>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media-controller>
 * ```
 */
@discover('vds-media-controller-connect')
export class MediaControllerElement extends WithMediaProviderBridge(
  LitElement
) {
  static override get styles(): CSSResultGroup {
    return [mediaControllerStyles];
  }

  protected override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected readonly _disconnectDisposal = new DisposalBin(
    this,
    /* c8 ignore next */
    DEV_MODE && { name: 'disconnectDisposal', owner: this }
  );

  override connectedCallback() {
    /* c8 ignore start */
    if (DEV_MODE) {
      this._logEvents();
    }
    /* c8 ignore stop */

    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectDisposal.empty();
  }

  // -------------------------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------------------------

  protected _logEvents() {
    /* c8 ignore start */
    if (DEV_MODE) {
      const loggedEvents: (keyof GlobalEventHandlersEventMap)[] = [
        'vds-controls-change',
        'vds-fullscreen-change'
      ];

      loggedEvents.forEach((eventType) => {
        const dispose = listen(this, eventType, (event) => {
          this._logger
            .infoGroup(`📡 dispatching \`${eventType}\``)
            .appendWithLabel('Event', event)
            .appendWithLabel('Container', this.mediaContainer)
            .appendWithLabel('Provider', this.mediaProvider)
            .end();
        });

        this._disconnectDisposal.add(dispose);
      });
    }
    /* c8 ignore stop */
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  readonly controlsManager = new ControlsManager(this);

  readonly idleManager = new IdleManager(this);

  /* c8 ignore next */
  protected readonly _logger = DEV_MODE && new ElementLogger(this);

  /**
   * An immutable snapshot of the current media state.
   */
  get mediaState(): Readonly<ExtractContextRecordTypes<typeof mediaContext>> {
    return cloneMediaContextRecord(this.ctx);
  }

  protected _logLevelCtx = logLevel.provide(this);

  /**
   * Sets the default log level throughout the player. Valid values in order of
   * level include `silent`, `error`, `warn`, `info` and `debug`.
   *
   * @default `silent`
   */
  @property({ attribute: 'log-level' })
  get logLevel(): LogLevelName {
    /* c8 ignore next */
    return DEV_MODE ? LogLevelNameMap[this._logLevelCtx.value] : 'silent';
  }

  set logLevel(newLevel: LogLevelName) {
    /* c8 ignore next */
    const numericLevel = DEV_MODE
      ? Object.values(LogLevelNameMap).findIndex((l) => l === newLevel)
      : 0;

    this._logger.level = numericLevel >= 0 ? numericLevel : 0;
  }

  /**
   * Indicates whether a custom user interface should be shown for controlling the resource. If
   * `true`, it is expected that `controls` is set to `false` (the default) to avoid double
   * controls. The `controls` property refers to native controls.
   *
   * @default false
   */
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

  /**
   * The amount of time in `ms` to pass before considering the user to be idle (not active).
   *
   * @default 3000
   */
  @property({ attribute: 'idle-timeout', type: Number })
  get idleTimeout() {
    return this.idleManager.timeout;
  }

  set idleTimeout(timeout) {
    this.idleManager.timeout = timeout;
  }

  // -------------------------------------------------------------------------------------------
  // Media Container
  // -------------------------------------------------------------------------------------------

  protected _mediaContainer: MediaContainerElement | undefined;

  /**
   * The current media container that belongs to this controller. Defaults to `undefined` if
   * there is none.
   */
  get mediaContainer() {
    return this._mediaContainer;
  }

  @eventListener('vds-media-container-connect')
  protected _handleMediaContainerConnect(
    event: MediaContainerConnectEvent
  ): void {
    event.stopPropagation();
    this._handleMediaContainerDisconnect();
    const { element, onDisconnect } = event.detail;

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .infoGroup('media container connected')
        .appendWithLabel('Container', element)
        .end();
    }
    /* c8 ignore stop */

    this._mediaContainer = element;
    onDisconnect(this._handleMediaContainerDisconnect.bind(this));
  }

  protected _handleMediaContainerDisconnect(): void {
    if (isNil(this.mediaContainer)) return;

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .infoGroup('media container disconnected')
        .appendWithLabel('Container', this._mediaContainer)
        .end();
    }
    /* c8 ignore stop */

    this._mediaContainer = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  /**
   * Override this to allow media events to bubble up the DOM.
   *
   * @param event
   */
  protected _mediaRequestEventGateway(event: Event) {
    event.stopPropagation();

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .infoGroup(`📬 received \`${event.type}\``)
        .appendWithLabel('Request', event)
        .end();
    }
    /* c8 ignore stop */
  }

  @eventListener('vds-mute-request')
  protected _handleMuteRequest(event: MuteRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.muted = true;
  }

  @eventListener('vds-unmute-request')
  protected _handleUnmuteRequest(event: UnmuteRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.muted = false;
  }

  @eventListener('vds-play-request')
  protected _handlePlayRequest(event: PlayRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.paused = false;
  }

  @eventListener('vds-pause-request')
  protected _handlePauseRequest(event: PauseRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.paused = true;
  }

  protected _isSeeking = false;

  @eventListener('vds-seeking-request')
  protected _handleSeekingRequest(event: SeekingRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this._isSeeking = true;
    this.currentTime = event.detail;
  }

  @eventListener('seeked', { capture: true })
  @eventListener('vds-seeked', { capture: true })
  protected _handleMediaSeeked(event: Event): void {
    // We don't want `seeked` events firing while seeking is updating media playback position.
    if (this._isSeeking) event.stopImmediatePropagation();
  }

  @eventListener('vds-seek-request')
  protected _handleSeekRequest(event: SeekRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this._isSeeking = false;
    this.currentTime = event.detail;
  }

  @eventListener('vds-volume-change-request')
  protected _handleVolumeChangeRequest(event: VolumeChangeRequestEvent): void {
    this._mediaRequestEventGateway(event);
    this.volume = event.detail;
  }

  @eventListener('vds-enter-fullscreen-request')
  protected async _handleEnterFullscreenRequest(
    event: EnterFullscreenRequestEvent
  ): Promise<void> {
    this._mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.requestFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.requestFullscreen();
    }
  }

  @eventListener('vds-exit-fullscreen-request')
  protected async _handleExitFullscreenRequest(
    event: ExitFullscreenRequestEvent
  ): Promise<void> {
    this._mediaRequestEventGateway(event);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}
