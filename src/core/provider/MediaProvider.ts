import {
  html,
  internalProperty,
  LitElement,
  TemplateResult,
} from 'lit-element';
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

  abstract isMuted(): PlayerState['muted'];
  abstract setMuted(isMuted: PlayerState['muted']): void;

  abstract isControlsVisible(): PlayerState['controls'];
  abstract setControlsVisibility(isVisible: PlayerState['controls']): void;

  abstract getPoster(): PlayerState['poster'];
  abstract setPoster(newPoster: PlayerState['poster']): void;

  // Readonly.
  abstract isReady(): PlayerState['isProviderReady'];
  abstract isPlaybackReady(): PlayerState['isPlaybackReady'];
  abstract isPaused(): PlayerState['paused'];
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

  @internalProperty()
  protected shouldRenderProvider = false;

  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract loadMedia(newSrc: Source): Promise<void>;

  /**
   * Render your provider in this method. It won't be mounted immediately, the player will
   * decide when it's your time by calling the `init` method on the provider, which will
   * automatically trigger the render to happen as long as you call `super.init()` in your
   * override.
   */
  protected abstract renderProvider(): TemplateResult;

  /**
   * Override this method to initialize the provider. Remember to call `super.init()`!
   */
  async init(): Promise<void> {
    this.shouldRenderProvider = true;
  }

  /**
   * Override this method to perform any cleanup operations. Remember to call `super.destroy()`!
   */
  async destroy(): Promise<void> {
    this.shouldRenderProvider = false;
  }

  /**
   * **DO NOT OVERRIDE!** - render inside the `renderProvider` method instead. The player
   * must control the provider render cycle.
   */
  protected render(): TemplateResult {
    if (!this.shouldRenderProvider) return html``;
    return this.renderProvider();
  }
}
