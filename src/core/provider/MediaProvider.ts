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

  abstract readonly isPlaybackReady: PlayerState['isPlaybackReady'];
  abstract readonly isPlaying: PlayerState['isPlaying'];
  abstract readonly currentSrc: PlayerState['currentSrc'];
  abstract readonly currentPoster: PlayerState['currentPoster'];
  abstract readonly internalPlayer: InternalPlayerType;
  abstract readonly viewType: PlayerState['viewType'];
  abstract readonly mediaType: PlayerState['mediaType'];
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
