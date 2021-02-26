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
 * @fires {AspectRatioChangeEvent} vds-aspect-ratio-change - Emitted when the aspect ratio changes.
 * @fires {ProviderConnectEvent} vds-provider-connect - Emitted when the provider attempts to connect to the player.
 * @fires {ProviderDisconnectEvent} vds-provider-disconnect - Emitted when the provider attempts to disconnect from the player.
 * @fires {ProviderPlayEvent} vds-provider-play - Emitted when playback attempts to start.
 * @fires {ProviderPauseEvent} vds-provider-pause - Emitted when playback pauses.
 * @fires {ProviderPlayingEvent} vds-provider-playing - Emitted when playback being playback.
 * @fires {ProviderSrcChangeEvent} vds-provider-src-change - Emitted when the current src changes.
 * @fires {ProviderPosterChangeEvent} vds-provider-poster-change - Emitted when the current poster changes.
 * @fires {ProviderMutedChangeEvent} vds-provider-muted-change - Emitted when the muted state of the current provider changes.
 * @fires {ProviderVolumeChangeEvent} vds-provider-volume-change - Emitted when the volume state of the current provider changes.
 * @fires {ProviderTimeChangeEvent} vds-provider-time-change - Emitted when the current playback time changes.
 * @fires {ProviderDurationChangeEvent} vds-provider-duration-change - Emitted when the length of the media changes.
 * @fires {ProviderBufferedChangeEvent} vds-provider-buffered-change - Emitted when the length of the media downloaded changes.
 * @fires {ProviderBufferingChangeEvent} vds-provider-buffering-change - Emitted when playback resumes/stops due to lack of data.
 * @fires {ProviderViewTypeChangeEvent} vds-provider-view-type-change - Emitted when the view type of the current provider/media changes.
 * @fires {ProviderMediaTypeChangeEvent} vds-provider-media-type-change - Emitted when the media type of the current provider/media changes.
 * @fires {ProviderPlaybackReadyEvent} vds-provider-playback-ready - Emitted when playback is ready to start - analgous with `canPlayThrough`.
 * @fires {ProviderPlaybackStartEvent} vds-provider-playback-start - Emitted when playback has started (`currentTime > 0`).
 * @fires {ProviderPlaybackEndEvent} vds-provider-playback-end - Emitted when playback ends (`currentTime === duration`).
 * @fires {ProviderErrorEvent} vds-provider-error - Emitted when a provider encounters an error during media loading/playback.
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

  abstract paused: PlayerState['paused'];
  abstract volume: PlayerState['volume'];
  abstract currentTime: PlayerState['currentTime'];
  abstract muted: PlayerState['muted'];
  abstract controls: PlayerState['controls'];

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying player that is actually responsible for rendering/loading media.
   */
  abstract readonly internalPlayer: InternalPlayerType | undefined;

  abstract readonly isPlaybackReady: PlayerState['isPlaybackReady'];
  abstract readonly isPlaying: PlayerState['isPlaying'];
  abstract readonly currentSrc: PlayerState['currentSrc'];
  abstract readonly currentPoster: PlayerState['currentPoster'];
  abstract readonly duration: PlayerState['duration'];
  abstract readonly buffered: PlayerState['buffered'];
  abstract readonly isBuffering: PlayerState['isBuffering'];
  abstract readonly hasPlaybackStarted: PlayerState['hasPlaybackStarted'];
  abstract readonly hasPlaybackEnded: PlayerState['hasPlaybackEnded'];

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
