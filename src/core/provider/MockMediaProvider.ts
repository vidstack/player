/* c8 ignore next 1000 */
import { html, TemplateResult } from 'lit-element';
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

  // -------------------------------------------------------------------------------------------
  // Getters + Setters
  // -------------------------------------------------------------------------------------------

  getCurrentSrc(): PlayerState['currentSrc'] {
    return '';
  }

  getVolume(): PlayerState['volume'] {
    return this.volume;
  }

  setVolume(newVolume: PlayerState['volume']): void {
    this.volume = newVolume;
  }

  getCurrentTime(): PlayerState['currentTime'] {
    return this.currentTime;
  }

  setCurrentTime(newTime: PlayerState['currentTime']): void {
    this.currentTime = newTime;
  }

  isPaused(): PlayerState['paused'] {
    return this.paused;
  }

  isMuted(): PlayerState['muted'] {
    return this.muted;
  }

  setMuted(isMuted: PlayerState['muted']): void {
    this.muted = isMuted;
  }

  isControlsVisible(): PlayerState['controls'] {
    return this.controls;
  }

  setControlsVisibility(isVisible: PlayerState['controls']): void {
    this.controls = isVisible;
  }

  getPoster(): PlayerState['currentPoster'] {
    return playerContext.currentPoster.defaultValue;
  }

  isPlaybackReady(): PlayerState['isPlaybackReady'] {
    return playerContext.isPlaybackReady.defaultValue;
  }

  getInternalPlayer(): unknown {
    return undefined;
  }

  getViewType(): PlayerState['viewType'] {
    return ViewType.Unknown;
  }

  getMediaType(): PlayerState['mediaType'] {
    return MediaType.Unknown;
  }

  getDuration(): PlayerState['duration'] {
    return playerContext.duration.defaultValue;
  }

  getBuffered(): PlayerState['buffered'] {
    return playerContext.buffered.defaultValue;
  }

  isBuffering(): PlayerState['isBuffering'] {
    return playerContext.isBuffering.defaultValue;
  }

  hasPlaybackStarted(): PlayerState['hasPlaybackStarted'] {
    return playerContext.hasPlaybackStarted.defaultValue;
  }

  hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
    return playerContext.hasPlaybackEnded.defaultValue;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  canPlayType(): boolean {
    return false;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  async play(): Promise<void> {
    // no-op mock it.
  }

  async pause(): Promise<void> {
    // no-op mock it.
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`<div>MockMediaProvider</div>`;
  }
}
