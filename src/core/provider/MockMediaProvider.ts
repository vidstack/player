/* c8 ignore next 1000 */
import { html, property, TemplateResult } from 'lit-element';
import { playerContext } from '../player.context';
import { PlayerState } from '../player.types';
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
  volume = playerContext.volume.defaultValue;

  @property({ type: Number })
  currentTime = playerContext.currentTime.defaultValue;

  @property({ type: Boolean })
  paused = playerContext.paused.defaultValue;

  @property({ type: Boolean })
  muted = playerContext.muted.defaultValue;

  @property({ type: Boolean })
  controls = playerContext.controls.defaultValue;

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): PlayerState['currentSrc'] {
    return '';
  }

  get currentPoster(): PlayerState['currentPoster'] {
    return playerContext.currentPoster.defaultValue;
  }

  get isPlaybackReady(): PlayerState['isPlaybackReady'] {
    return playerContext.isPlaybackReady.defaultValue;
  }

  get isPlaying(): PlayerState['isPlaying'] {
    return playerContext.isPlaying.defaultValue;
  }

  get internalPlayer(): unknown {
    return undefined;
  }

  get duration(): PlayerState['duration'] {
    return playerContext.duration.defaultValue;
  }

  get buffered(): PlayerState['buffered'] {
    return playerContext.buffered.defaultValue;
  }

  get isBuffering(): PlayerState['isBuffering'] {
    return playerContext.isBuffering.defaultValue;
  }

  get hasPlaybackStarted(): PlayerState['hasPlaybackStarted'] {
    return playerContext.hasPlaybackStarted.defaultValue;
  }

  get hasPlaybackEnded(): PlayerState['hasPlaybackEnded'] {
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
