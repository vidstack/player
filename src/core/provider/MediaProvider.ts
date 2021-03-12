import { listen } from '@wcom/events';
import { LitElement, property } from 'lit-element';
import { StyleInfo } from 'lit-html/directives/style-map';

import { CanPlayType } from '../CanPlayType';
import {
  ConnectEvent,
  DisconnectEvent,
  PlaybackReadyEvent,
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
import { ProviderProps } from './provider.args';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication 💬
 */
export abstract class MediaProvider<EngineType = unknown>
  extends MediaProviderMixin(LitElement)
  implements PlayerProps, PlayerMethods, ProviderProps {
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

  // ---

  @property({ type: Boolean })
  playsinline = false;

  // ---

  @property({ type: Boolean })
  loop = false;

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

  abstract canPlayType(type: string): CanPlayType;

  shouldPlayType(type: string): boolean {
    const canPlayType = this.canPlayType(type);
    return (
      canPlayType === CanPlayType.Maybe || canPlayType === CanPlayType.Probably
    );
  }

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
  // Helpers
  // -------------------------------------------------------------------------------------------

  protected getAriaBusy(): 'true' | 'false' {
    return this.isPlaybackReady ? 'false' : 'true';
  }

  protected getContextStyleMap(): StyleInfo {
    return {
      '--vds-volume': String(this.volume),
      '--vds-current-time': String(this.currentTime),
      '--vds-duration': String(this.duration > 0 ? this.duration : 0),
      '--vds-buffered': String(this.buffered),
    };
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
}
