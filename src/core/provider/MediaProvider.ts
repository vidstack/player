import { LitElement, TemplateResult } from 'lit-element';
import { PlayerState, Source } from '../../core';

/**
 * Base abstract media provider class that defines the interface to be implemented by
 * all concrete media providers. Extending this class enables provider-agnostic communication
 * between the Player and any Provider 💬
 */
export abstract class MediaProvider<
  InternalPlayerType = unknown
> extends LitElement {
  /**
   * -------------------------------------------------------------------------------------------
   * Getters + Setters
   *
   * This section lists abstract methods for getting/setting state on the provider.
   * -------------------------------------------------------------------------------------------
   */

  abstract getVolume(): PlayerState['volume'];
  abstract setVolume(newVolume: PlayerState['volume']): void;

  abstract getCurrentTime(): PlayerState['currentTime'];
  abstract setCurrentTime(newTime: PlayerState['currentTime']): void;

  abstract getPaused(): PlayerState['paused'];
  abstract setPaused(isPaused: PlayerState['paused']): void;

  abstract getMuted(): PlayerState['muted'];
  abstract setMuted(isMuted: PlayerState['muted']): void;

  abstract getControlsVisibility(): PlayerState['controls'];
  abstract setControlsVisibility(isVisible: PlayerState['controls']): void;

  abstract getPoster(): PlayerState['poster'];
  abstract setPoster(newPoster: PlayerState['poster']): void;

  // Readonly.
  abstract isReady(): PlayerState['isProviderReady'];
  abstract isPlaybackReady(): PlayerState['isPlaybackReady'];
  abstract getInternalPlayer(): InternalPlayerType;
  abstract getViewType(): PlayerState['viewType'];
  abstract getMediaType(): PlayerState['mediaType'];
  abstract getDuration(): PlayerState['duration'];
  abstract getBuffered(): PlayerState['buffered'];
  abstract isBuffering(): PlayerState['isBuffering'];
  abstract hasPlaybackStarted(): PlayerState['hasPlaybackStarted'];
  abstract hasPlaybackEnded(): PlayerState['hasPlaybackEnded'];

  /**
   * -------------------------------------------------------------------------------------------
   * Fetch
   *
   * This section lists abstract methods for fetching (local/remote) information
   * about the current media.
   * -------------------------------------------------------------------------------------------
   */

  abstract fetchDuration(): Promise<PlayerState['duration']>;
  abstract fetchDefaultPoster(): Promise<PlayerState['poster']>;
  abstract fetchRecommendedAspectRatio(): Promise<PlayerState['aspectRatio']>;

  /**
   * -------------------------------------------------------------------------------------------
   * Support
   *
   * This section list abstract methods for determining feature support.
   * -------------------------------------------------------------------------------------------
   */

  abstract canPlayType(type: Source): boolean;

  /**
   * -------------------------------------------------------------------------------------------
   * Function
   *
   * This section lists abstract methods for performing some function on the player.
   * -------------------------------------------------------------------------------------------
   */

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract loadMedia(newSrc: Source): Promise<void>;
  abstract renderPlayer(): TemplateResult;
  abstract moveToBackground(): void;
  abstract destroy(): void;

  protected render(): void {
    throw Error(
      '[PROBLEM] Using the `render` method is not allowed!' +
        "The Player is responsible for managing the provider's rendering.\n\n" +
        `[SOLUTION] Move rendering inside the \`renderPlayer\` method in \`${this.constructor.name}\`.`,
    );
  }
}
