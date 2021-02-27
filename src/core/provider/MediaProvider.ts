import { LitElement } from 'lit-element';
import {
  PlayerState,
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  ProviderMixin,
} from '../../core';
import { PlayerMethods } from '../player.types';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication
 * between the Player and any Provider 💬
 *
 * @event {AspectRatioChangeEvent} vds-aspect-ratio-change - Emitted when the aspect ratio changes.
 * @event {ProviderConnectEvent} vds-provider-connect - Emitted when the provider attempts to connect to the player.
 * @event {ProviderDisconnectEvent} vds-provider-disconnect - Emitted when the provider attempts to disconnect from the player.
 * @event {ProviderPlayEvent} vds-provider-play - Emitted when playback attempts to start.
 * @event {ProviderPauseEvent} vds-provider-pause - Emitted when playback pauses.
 * @event {ProviderPlayingEvent} vds-provider-playing - Emitted when playback being playback.
 * @event {ProviderSrcChangeEvent} vds-provider-src-change - Emitted when the current src changes.
 * @event {ProviderPosterChangeEvent} vds-provider-poster-change - Emitted when the current poster changes.
 * @event {ProviderMutedChangeEvent} vds-provider-muted-change - Emitted when the muted state of the current provider changes.
 * @event {ProviderVolumeChangeEvent} vds-provider-volume-change - Emitted when the volume state of the current provider changes.
 * @event {ProviderTimeChangeEvent} vds-provider-time-change - Emitted when the current playback time changes.
 * @event {ProviderDurationChangeEvent} vds-provider-duration-change - Emitted when the length of the media changes.
 * @event {ProviderBufferedChangeEvent} vds-provider-buffered-change - Emitted when the length of the media downloaded changes.
 * @event {ProviderBufferingChangeEvent} vds-provider-buffering-change - Emitted when playback resumes/stops due to lack of data.
 * @event {ProviderViewTypeChangeEvent} vds-provider-view-type-change - Emitted when the view type of the current provider/media changes.
 * @event {ProviderMediaTypeChangeEvent} vds-provider-media-type-change - Emitted when the media type of the current provider/media changes.
 * @event {ProviderPlaybackReadyEvent} vds-provider-playback-ready - Emitted when playback is ready to start - analgous with `canPlayThrough`.
 * @event {ProviderPlaybackStartEvent} vds-provider-playback-start - Emitted when playback has started (`currentTime > 0`).
 * @event {ProviderPlaybackEndEvent} vds-provider-playback-end - Emitted when playback ends (`currentTime === duration`).
 * @event {ProviderErrorEvent} vds-provider-error - Emitted when a provider encounters an error during media loading/playback.
 */
export abstract class MediaProvider<InternalPlayerType = unknown>
  extends ProviderMixin(LitElement)
  implements PlayerState, PlayerMethods {
  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchEvent(new ProviderConnectEvent({ detail: this }));
  }

  disconnectedCallback(): void {
    this.dispatchEvent(new ProviderDisconnectEvent({ detail: this }));
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Writable Properties
  // -------------------------------------------------------------------------------------------

  abstract paused: boolean;
  abstract volume: number;
  abstract currentTime: number;
  abstract muted: boolean;
  abstract controls: boolean;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying player that is actually responsible for rendering/loading media.
   */
  abstract readonly internalPlayer: InternalPlayerType | undefined;

  abstract readonly isPlaybackReady: boolean;
  abstract readonly isPlaying: boolean;
  abstract readonly currentSrc: string;
  abstract readonly currentPoster: string;
  abstract readonly duration: number;
  abstract readonly buffered: number;
  abstract readonly isBuffering: boolean;
  abstract readonly hasPlaybackStarted: boolean;
  abstract readonly hasPlaybackEnded: boolean;

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  abstract canPlayType(type: string): boolean;

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
}
