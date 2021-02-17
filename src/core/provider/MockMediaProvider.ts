import { html, TemplateResult } from 'lit-html';
import { playerContext } from '../player.context';
import { ViewType, MediaType, PlayerState } from '../player.types';
import { MediaProvider } from './MediaProvider';

/**
 * A mock media provider that's used for testing. This class alone does nothing special. It can
 * combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class MockMediaProvider extends MediaProvider {
  protected volume = playerContext.volume.defaultValue;

  protected currentTime = playerContext.currentTime.defaultValue;

  protected paused = playerContext.paused.defaultValue;

  protected muted = playerContext.muted.defaultValue;

  protected controls = playerContext.controls.defaultValue;

  protected poster = playerContext.poster.defaultValue;

  /**
   * -------------------------------------------------------------------------------------------
   * Getters + Setters
   *
   * This section lists methods for getting/setting state on the provider.
   * -------------------------------------------------------------------------------------------
   */

  getVolume(): number {
    return this.volume;
  }

  setVolume(newVolume: PlayerState['volume']): void {
    this.volume = newVolume;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  setCurrentTime(newTime: PlayerState['currentTime']): void {
    this.currentTime = newTime;
  }

  getPaused(): boolean {
    return this.paused;
  }

  setPaused(isPaused: PlayerState['paused']): void {
    this.paused = isPaused;
  }

  getMuted(): boolean {
    return this.muted;
  }

  setMuted(isMuted: PlayerState['muted']): void {
    this.muted = isMuted;
  }

  getControlsVisibility(): boolean {
    return this.controls;
  }

  setControlsVisibility(isVisible: PlayerState['controls']): void {
    this.controls = isVisible;
  }

  getPoster(): string | undefined {
    return this.poster;
  }

  setPoster(newPoster: PlayerState['poster']): void {
    this.poster = newPoster;
  }

  isReady(): boolean {
    return playerContext.isProviderReady.defaultValue;
  }

  isPlaybackReady(): boolean {
    return playerContext.isPlaybackReady.defaultValue;
  }

  getInternalPlayer(): unknown {
    return undefined;
  }

  getViewType(): ViewType {
    return ViewType.Unknown;
  }

  getMediaType(): MediaType {
    return MediaType.Unknown;
  }

  getDuration(): number {
    return playerContext.duration.defaultValue;
  }

  getBuffered(): number {
    return playerContext.buffered.defaultValue;
  }

  isBuffering(): boolean {
    return playerContext.isBuffering.defaultValue;
  }

  hasPlaybackStarted(): boolean {
    return playerContext.hasPlaybackStarted.defaultValue;
  }

  hasPlaybackEnded(): boolean {
    return playerContext.hasPlaybackEnded.defaultValue;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Fetch
   *
   * This section lists methods for fetching (local/remote) informationabout the current media.
   * -------------------------------------------------------------------------------------------
   */

  async fetchDuration(): Promise<number> {
    return 0;
  }

  async fetchDefaultPoster(): Promise<string | undefined> {
    return 'https://media.vidstack.io/poster.png';
  }

  async fetchRecommendedAspectRatio(): Promise<string> {
    return '16:9';
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Support
   *
   * This section list methods for determining feature support.
   * -------------------------------------------------------------------------------------------
   */

  canPlayType(): boolean {
    return false;
  }

  /**
   * -------------------------------------------------------------------------------------------
   * Function
   *
   * This section lists methods for performing some function on the provider.
   * -------------------------------------------------------------------------------------------
   */

  async play(): Promise<void> {
    // no-op mock it.
  }

  async pause(): Promise<void> {
    // no-op mock it.
  }

  async loadMedia(): Promise<void> {
    // no-op mock it.
  }

  moveToBackground(): void {
    // no-op mock it.
  }

  destroy(): void {
    // no-op mock it.
  }

  renderPlayer(): TemplateResult {
    return html`<div class="mock-media-provider"><slot></slot></div>`;
  }
}
