import { contextRecordProvider, provideContextRecord } from '@wcom/context';
import { listen } from '@wcom/events';
import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';

import { isNil } from '../../../utils/unit';
import {
  MediaContainerElement,
  VdsMediaContainerConnectEvent,
} from '../container';
import {
  mediaContext,
  mediaContextRecord,
  MediaContextRecordProvider,
} from '../media.context';
import {
  VdsEnterFullscreenRequestEvent,
  VdsExitFullscreenRequestEvent,
  VdsMuteRequestEvent,
  VdsPauseRequestEvent,
  VdsPlayRequestEvent,
  VdsSeekRequestEvent,
  VdsUnmuteRequestEvent,
  VdsVolumeChangeRequestEvent,
} from '../media-request.events';
import {
  MediaProviderElement,
  VdsMediaProviderConnectEvent,
} from '../provider';
import { mediaControllerStyles } from './media-controller.css';

/**
 * The media controller acts as a message bus between the media provider and all other
 * components, such as UI components. The two primary responsibilities are:
 *
 * - Provide the media context that is used to pass media state down to components (this
 * context is injected into and managed by the media provider).
 *
 * - Listen for media request events and fulfill them by calling the appropriate props/methods on
 * the current media provider.
 *
 * @tagname vds-media-controller
 *
 * @slot Used to pass in components that use/manage media state.
 *
 * @example
 * ```html
 * <vds-media-controller>
 *   <vds-media-container>
 *     <vds-video
 *       src="/media/video.mp4"
 *       poster="/media/poster.png"
 *       slot="media"
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
@provideContextRecord(mediaContext)
export class MediaControllerElement extends LitElement {
  static get styles(): CSSResultGroup {
    return [mediaControllerStyles];
  }

  // -------------------------------------------------------------------------------------------
  // Context
  // -------------------------------------------------------------------------------------------

  /**
   * The media context record. Any property updated inside this object will trigger a context
   * update that will flow down to all consumer components. This record is consumed by
   * a media provider element as it's responsible for managing it (ie: updating context properties).
   *
   * @internal Exposed for testing.
   */
  // Has to be in this order otherwise the `provide()` decorator will overwrite the context record.
  // Remember decorators are evaluated top-to-bottom! - https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-composition
  @contextRecordProvider(mediaContext)
  @mediaContextRecord.provide()
  readonly context!: MediaContextRecordProvider;

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  protected render(): TemplateResult {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Media Container
  // -------------------------------------------------------------------------------------------

  protected _mediaContainer?: MediaContainerElement;

  /**
   * The current media container that belongs to this controller. Defaults to `undefined` if
   * there is none.
   */
  get mediaContainer(): MediaContainerElement | undefined {
    return this._mediaContainer;
  }

  @listen(VdsMediaContainerConnectEvent.TYPE)
  protected handleMediaContainerConnect(
    e: VdsMediaContainerConnectEvent,
  ): void {
    const { container, onDisconnect } = e.detail;
    this._mediaContainer = container;
    onDisconnect(() => {
      this._mediaContainer = undefined;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Provider
  // -------------------------------------------------------------------------------------------

  protected _mediaProvider?: MediaProviderElement;

  /**
   * The current media provider that belongs to this controller. Defaults to `undefined` if there
   * is none.
   */
  get mediaProvider(): MediaProviderElement | undefined {
    return this._mediaProvider;
  }

  @listen(VdsMediaProviderConnectEvent.TYPE)
  protected handleMediaProviderConnect(e: VdsMediaProviderConnectEvent): void {
    const { provider, onDisconnect } = e.detail;
    this._mediaProvider = provider;
    onDisconnect(() => {
      this._mediaProvider = undefined;
    });
  }

  // -------------------------------------------------------------------------------------------
  // Media Request Events
  // -------------------------------------------------------------------------------------------

  protected mediaRequestEventGateway(e: Event): void {
    e.stopPropagation();
  }

  @listen(VdsMuteRequestEvent.TYPE)
  protected handleMuteRequest(e: VdsMuteRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = true;
    }
  }

  @listen(VdsUnmuteRequestEvent.TYPE)
  protected handleUnmuteRequest(e: VdsUnmuteRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.muted = false;
    }
  }

  @listen(VdsPlayRequestEvent.TYPE)
  protected handlePlayRequest(e: VdsPlayRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = false;
    }
  }

  @listen(VdsPauseRequestEvent.TYPE)
  protected handlePauseRequest(e: VdsPauseRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.paused = true;
    }
  }

  @listen(VdsSeekRequestEvent.TYPE)
  protected handleSeekRequest(e: VdsSeekRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.currentTime = e.detail;
    }
  }

  @listen(VdsVolumeChangeRequestEvent.TYPE)
  protected handleVolumeChangeRequest(e: VdsVolumeChangeRequestEvent): void {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaProvider)) {
      this.mediaProvider.volume = e.detail;
    }
  }

  @listen(VdsEnterFullscreenRequestEvent.TYPE)
  protected async handleEnterFullscreenRequest(
    e: VdsEnterFullscreenRequestEvent,
  ): Promise<void> {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.requestFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.requestFullscreen();
    }
  }

  @listen(VdsExitFullscreenRequestEvent.TYPE)
  protected async handleExitFullscreenRequest(
    e: VdsExitFullscreenRequestEvent,
  ): Promise<void> {
    this.mediaRequestEventGateway(e);
    if (!isNil(this.mediaContainer)) {
      await this.mediaContainer.exitFullscreen();
    } else if (!isNil(this.mediaProvider)) {
      await this.mediaProvider.exitFullscreen();
    }
  }
}
