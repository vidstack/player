import { event } from '@wcom/events';
import { LitElement } from 'lit-element';

import { PlayerMethods, PlayerState } from '../player.types';
import {
  ProviderConnectEvent,
  ProviderDisconnectEvent,
  VdsProviderEvents,
} from './provider.events';
import { ProviderCompositeMixin } from './ProviderCompositeMixin';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication
 * between the Player and any Provider 💬
 */
export abstract class MediaProvider<InternalPlayerType = unknown>
  extends ProviderCompositeMixin(LitElement)
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

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely for documentation purposes only. The `@wcom/cli` library will pick up on these
  // and include them in any transformations such as docs. Any minifier should notice these
  // are not used and drop them.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when the provider attempts to connect to the player.
   */
  @event({ name: 'vds-provider-connect' })
  protected connectEvent!: VdsProviderEvents['vds-provider-connect'];

  /**
   * Emitted when the provider attempts to disconnect from the player.
   */
  @event({ name: 'vds-provider-disconnect' })
  protected disconnectEvent!: VdsProviderEvents['vds-provider-disconnect'];

  /**
   * Emitted when playback attempts to start.
   */
  @event({ name: 'vds-provider-play' })
  protected playEvent!: VdsProviderEvents['vds-provider-play'];

  /**
   * Emitted when playback pauses.
   */
  @event({ name: 'vds-provider-pause' })
  protected pauseEvent!: VdsProviderEvents['vds-provider-pause'];

  /**
   * Emitted when playback being playback.
   */
  @event({ name: 'vds-provider-playing' })
  protected playingEvent!: VdsProviderEvents['vds-provider-playing'];

  /**
   * Emitted when the current src changes.
   */
  @event({ name: 'vds-provider-src-change' })
  protected srcChangeEvent!: VdsProviderEvents['vds-provider-src-change'];

  /**
   * Emitted when the current poster changes.
   */
  @event({ name: 'vds-provider-poster-change' })
  protected posterChangeEvent!: VdsProviderEvents['vds-provider-poster-change'];

  /**
   * Emitted when the muted state of the current provider changes.
   */
  @event({ name: 'vds-provider-muted-change' })
  protected mutedChangeEvent!: VdsProviderEvents['vds-provider-muted-change'];

  /**
   * Emitted when the volume state of the current provider changes.
   */
  @event({ name: 'vds-provider-volume-change' })
  protected volumeChangeEvent!: VdsProviderEvents['vds-provider-volume-change'];

  /**
   * Emitted when the current playback time changes.
   */
  @event({ name: 'vds-provider-time-change' })
  protected timeChangeEvent!: VdsProviderEvents['vds-provider-time-change'];

  /**
   * Emitted when the length of the media changes.
   */
  @event({ name: 'vds-provider-duration-change' })
  protected durationChangeEvent!: VdsProviderEvents['vds-provider-duration-change'];

  /**
   * Emitted when the length of the media downloaded changes.
   */
  @event({ name: 'vds-provider-buffered-change' })
  protected bufferedChangeEvent!: VdsProviderEvents['vds-provider-buffered-change'];

  /**
   * Emitted when playback resumes/stops due to lack of data.
   */
  @event({ name: 'vds-provider-buffering-change' })
  protected bufferingChangeEvent!: VdsProviderEvents['vds-provider-buffering-change'];

  /**
   * Emitted when the view type of the current provider/media changes.
   */
  @event({ name: 'vds-provider-view-type-change' })
  protected viewTypeChangeEvent!: VdsProviderEvents['vds-provider-view-type-change'];

  /**
   * Emitted when the media type of the current provider/media changes.
   */
  @event({ name: 'vds-provider-media-type-change' })
  protected mediaTypeChangeEvent!: VdsProviderEvents['vds-provider-media-type-change'];

  /**
   * Emitted when playback is ready to start - analgous with `canPlayThrough`.
   */
  @event({ name: 'vds-provider-playback-ready' })
  protected playbackReadyEvent!: VdsProviderEvents['vds-provider-playback-ready'];

  /**
   * Emitted when playback has started (`currentTime > 0`).
   */
  @event({ name: 'vds-provider-playback-start' })
  protected playbackStartEvent!: VdsProviderEvents['vds-provider-playback-start'];

  /**
   * Emitted when playback ends (`currentTime === duration`).
   */
  @event({ name: 'vds-provider-playback-end' })
  protected playbackEndEvent!: VdsProviderEvents['vds-provider-playback-end'];

  /**
   * Emitted when a provider encounters an error during media loading/playback.
   */
  @event({ name: 'vds-provider-error' })
  protected error!: VdsProviderEvents['vds-provider-error'];
}
