/* c8 ignore next 1000 */
import { html, property, TemplateResult } from 'lit-element';

import { playerContext } from '../player.context';
import { MediaProvider } from './MediaProvider';

/**
 * A mock media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class MockMediaProvider extends MediaProvider {
  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  @property({ type: Number })
  volume = 1;

  @property({ type: Number })
  currentTime = 0;

  @property({ type: Boolean })
  paused = true;

  @property({ type: Boolean })
  muted = false;

  @property({ type: Boolean })
  controls = false;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): string {
    return '';
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

  get internalPlayer(): unknown {
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
