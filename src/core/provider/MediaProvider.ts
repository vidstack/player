import { event, listen } from '@wcom/events';
import { LitElement, property } from 'lit-element';

import {
  ConnectEvent,
  DisconnectEvent,
  PlaybackReadyEvent,
  PlayerEvents,
} from '../player.events';
import { PlayerMethods, PlayerProps } from '../player.types';
import {
  UserMutedChangeRequestEvent,
  UserPauseRequestEvent,
  UserPlayRequestEvent,
  UserTimeChangeRequestEvent,
  UserVolumeChangeRequestEvent,
} from '../user/user.events';
import { MediaProviderMixin } from './MediaProviderMixin';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 */
export abstract class MediaProvider<EngineType = unknown>
  extends MediaProviderMixin(LitElement)
  implements PlayerProps, PlayerMethods {
  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchEvent(new ConnectEvent({ detail: this }));
  }

  disconnectedCallback(): void {
    this.dispatchEvent(new DisconnectEvent({ detail: this }));
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Writable Properties
  // -------------------------------------------------------------------------------------------

  @property({ type: Number })
  get volume(): number {
    return this.isPlaybackReady ? this.getVolume() : 1;
  }

  set volume(newVolume: number) {
    this.makeRequest('volume', () => {
      this.setVolume(newVolume);
    });
  }

  protected abstract getVolume(): number;
  protected abstract setVolume(newVolume: number): void;

  // ---

  @property({ type: Boolean })
  get paused(): boolean {
    return this.isPlaybackReady ? this.getPaused() : true;
  }

  set paused(isPaused: boolean) {
    this.makeRequest('paused', () => {
      if (!isPaused) {
        this.play();
      } else {
        this.pause();
      }
    });
  }

  protected abstract getPaused(): boolean;

  // ---

  @property({ type: Number, attribute: 'current-time' })
  get currentTime(): number {
    return this.isPlaybackReady ? this.getCurrentTime() : 0;
  }

  set currentTime(newTime: number) {
    this.makeRequest('time', () => {
      this.setCurrentTime(newTime);
    });
  }

  protected abstract getCurrentTime(): number;
  protected abstract setCurrentTime(newTime: number): void;

  // ---

  @property({ type: Boolean })
  get muted(): boolean {
    return this.isPlaybackReady ? this.getMuted() : false;
  }

  set muted(isMuted: boolean) {
    this.makeRequest('muted', () => {
      this.setMuted(isMuted);
    });
  }

  protected abstract getMuted(): boolean;
  protected abstract setMuted(isMuted: boolean): void;

  // ---

  @property({ type: Boolean })
  controls = false;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  /**
   * The underlying engine that is actually responsible for rendering/loading media. Some examples
   * are:
   *
   * - `VideProvider` engine is `HTMLMediaElement`.
   * - `YoutubeProvider` engine is `HTMLIFrameElement`.
   * - `HLSProvider` engine is the `Hls.js` instance.
   *
   * Refer to the respective provider documentation to find out which engine is powering it.
   */
  abstract readonly engine: EngineType;

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

  protected throwIfNotReady(): void {
    if (!this.isPlaybackReady) {
      throw Error(
        `Media is not ready - wait for \`${PlaybackReadyEvent.TYPE}\` event.`,
      );
    }
  }

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;

  // -------------------------------------------------------------------------------------------
  // ARIA Helpers
  // -------------------------------------------------------------------------------------------

  protected getAriaBusy(): 'true' | 'false' {
    return this.isPlaybackReady ? 'false' : 'true';
  }

  // -------------------------------------------------------------------------------------------
  // User Handlers
  // -------------------------------------------------------------------------------------------

  /**
   * Allows user events to bubble up through the player.
   */
  @property({ type: Boolean, attribute: 'allow-user-events-to-bubble' })
  allowUserEventsToBubble = false;

  protected userEventGateway(e: Event): void {
    if (!this.allowUserEventsToBubble) e.stopPropagation();
  }

  @listen(UserPlayRequestEvent.TYPE)
  protected handleUserPlayRequest(e: UserPlayRequestEvent): void {
    this.userEventGateway(e);
    this.paused = false;
  }

  @listen(UserPauseRequestEvent.TYPE)
  protected handleUserPauseRequest(e: UserPauseRequestEvent): void {
    this.userEventGateway(e);
    this.paused = true;
  }

  @listen(UserMutedChangeRequestEvent.TYPE)
  protected handleUserMutedChangeRequest(e: UserMutedChangeRequestEvent): void {
    this.userEventGateway(e);
    this.muted = e.detail;
  }

  @listen(UserTimeChangeRequestEvent.TYPE)
  protected handleUserTimeChangeRequest(e: UserTimeChangeRequestEvent): void {
    this.userEventGateway(e);
    this.currentTime = e.detail;
  }

  @listen(UserVolumeChangeRequestEvent.TYPE)
  protected handleUserVolumeChangeRequest(
    e: UserVolumeChangeRequestEvent,
  ): void {
    this.userEventGateway(e);
    this.volume = e.detail;
  }

  // -------------------------------------------------------------------------------------------
  // Event Documentation
  //
  // Purely for documentation purposes only. The `@wcom/cli` library will pick up on these
  // and include them in any transformations such as docs. Any minifier should notice these
  // are not used and drop them.
  // -------------------------------------------------------------------------------------------

  /**
   * Emitted when the provider connects to the DOM.
   */
  @event({ name: 'vds-connect' })
  protected connectEvent!: PlayerEvents['vds-connect'];

  /**
   * Emitted when the provider disconnects from the DOM.
   */
  @event({ name: 'vds-disconnect' })
  protected disconnectEvent!: PlayerEvents['vds-disconnect'];

  /**
   * Emitted when playback attempts to start.
   */
  @event({ name: 'vds-play' })
  protected playEvent!: PlayerEvents['vds-play'];

  /**
   * Emitted when playback pauses.
   */
  @event({ name: 'vds-pause' })
  protected pauseEvent!: PlayerEvents['vds-pause'];

  /**
   * Emitted when playback being playback.
   */
  @event({ name: 'vds-playing' })
  protected playingEvent!: PlayerEvents['vds-playing'];

  /**
   * Emitted when the current src changes.
   */
  @event({ name: 'vds-src-change' })
  protected srcChangeEvent!: PlayerEvents['vds-src-change'];

  /**
   * Emitted when the current poster changes.
   */
  @event({ name: 'vds-poster-change' })
  protected posterChangeEvent!: PlayerEvents['vds-poster-change'];

  /**
   * Emitted when the muted state changes.
   */
  @event({ name: 'vds-muted-change' })
  protected mutedChangeEvent!: PlayerEvents['vds-muted-change'];

  /**
   * Emitted when the volume state changes.
   */
  @event({ name: 'vds-volume-change' })
  protected volumeChangeEvent!: PlayerEvents['vds-volume-change'];

  /**
   * Emitted when the current playback time changes.
   */
  @event({ name: 'vds-time-change' })
  protected timeChangeEvent!: PlayerEvents['vds-time-change'];

  /**
   * Emitted when the length of the media changes.
   */
  @event({ name: 'vds-duration-change' })
  protected durationChangeEvent!: PlayerEvents['vds-duration-change'];

  /**
   * Emitted when the length of the media downloaded changes.
   */
  @event({ name: 'vds-buffered-change' })
  protected bufferedChangeEvent!: PlayerEvents['vds-buffered-change'];

  /**
   * Emitted when playback resumes/stops due to lack of data.
   */
  @event({ name: 'vds-buffering-change' })
  protected bufferingChangeEvent!: PlayerEvents['vds-buffering-change'];

  /**
   * Emitted when the view type of the current provider/media changes.
   */
  @event({ name: 'vds-view-type-change' })
  protected viewTypeChangeEvent!: PlayerEvents['vds-view-type-change'];

  /**
   * Emitted when the media type of the current provider/media changes.
   */
  @event({ name: 'vds-media-type-change' })
  protected mediaTypeChangeEvent!: PlayerEvents['vds-media-type-change'];

  /**
   * Emitted when playback is ready to start - analgous with `canPlay`.
   */
  @event({ name: 'vds-playback-ready' })
  protected playbackReadyEvent!: PlayerEvents['vds-playback-ready'];

  /**
   * Emitted when playback has started (`currentTime > 0`).
   */
  @event({ name: 'vds-playback-start' })
  protected playbackStartEvent!: PlayerEvents['vds-playback-start'];

  /**
   * Emitted when playback ends (`currentTime === duration`).
   */
  @event({ name: 'vds-playback-end' })
  protected playbackEndEvent!: PlayerEvents['vds-playback-end'];

  /**
   * Emitted when a provider encounters any error.
   */
  @event({ name: 'vds-error' })
  protected errorEvent!: PlayerEvents['vds-error'];
}
