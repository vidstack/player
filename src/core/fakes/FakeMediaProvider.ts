/* c8 ignore next 1000 */
import { html, property, TemplateResult } from 'lit-element';

import { CanPlayType } from '../CanPlayType';
import {
  MutedChangeEvent,
  PauseEvent,
  PlaybackReadyEvent,
  PlayEvent,
  TimeChangeEvent,
  VolumeChangeEvent,
} from '../player.events';
import { MediaProvider } from '../provider/MediaProvider';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProvider extends MediaProvider {
  @property({ type: Boolean }) playbackReady = false;

  connectedCallback(): void {
    super.connectedCallback();

    if (this.playbackReady) {
      this.context.isPlaybackReady = true;
      this.dispatchEvent(new PlaybackReadyEvent());
    }
  }

  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getPaused(): boolean {
    return this.context.paused;
  }

  getVolume(): number {
    return this.context.volume;
  }

  setVolume(detail: number): void {
    this.context.volume = detail;
    this.dispatchEvent(new VolumeChangeEvent({ detail }));
  }

  getCurrentTime(): number {
    return this.context.currentTime;
  }

  setCurrentTime(detail: number): void {
    this.context.currentTime = detail;
    this.dispatchEvent(new TimeChangeEvent({ detail }));
  }

  getMuted(): boolean {
    return this.context.muted;
  }

  setMuted(detail: boolean): void {
    this.context.muted = detail;
    this.dispatchEvent(new MutedChangeEvent({ detail }));
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine(): unknown {
    return undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Support Checks
  // -------------------------------------------------------------------------------------------

  canPlayType(): CanPlayType {
    return CanPlayType.No;
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  async play(): Promise<void> {
    this.context.paused = false;
    this.dispatchEvent(new PlayEvent());
  }

  async pause(): Promise<void> {
    this.context.paused = true;
    this.dispatchEvent(new PauseEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}
