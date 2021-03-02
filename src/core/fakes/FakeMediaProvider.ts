/* c8 ignore next 1000 */
import { html, TemplateResult } from 'lit-element';

import { playerContext } from '../player.context';
import { MediaProvider } from '../provider/MediaProvider';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProvider extends MediaProvider {
  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getPaused(): boolean {
    return true;
  }

  getVolume(): number {
    return 1;
  }

  setVolume(): void {
    // no-op
  }

  getCurrentTime(): number {
    return 0;
  }

  setCurrentTime(): void {
    // no-op
  }

  getMuted(): boolean {
    return false;
  }

  setMuted(): void {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): string {
    return playerContext.currentSrc.defaultValue;
  }

  get currentPoster(): string {
    return playerContext.currentPoster.defaultValue;
  }

  get isPlaybackReady(): boolean {
    return playerContext.isPlaybackReady.defaultValue;
  }

  get isPlaying(): boolean {
    return playerContext.isPlaying.defaultValue;
  }

  get engine(): unknown {
    return undefined;
  }

  get duration(): number {
    return playerContext.duration.defaultValue;
  }

  get buffered(): number {
    return playerContext.buffered.defaultValue;
  }

  get isBuffering(): boolean {
    return playerContext.isBuffering.defaultValue;
  }

  get hasPlaybackStarted(): boolean {
    return playerContext.hasPlaybackStarted.defaultValue;
  }

  get hasPlaybackEnded(): boolean {
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
    // no-op
  }

  async pause(): Promise<void> {
    // no-op
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`<div><slot></slot></div>`;
  }
}
