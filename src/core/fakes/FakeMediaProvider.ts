/* c8 ignore next 1000 */
import { html, property, TemplateResult } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

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
      this.context.isPlaybackReadyCtx = true;
      this.dispatchEvent(new PlaybackReadyEvent());
    }
  }

  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getPaused(): boolean {
    return this.context.pausedCtx;
  }

  getVolume(): number {
    return this.context.volumeCtx;
  }

  setVolume(detail: number): void {
    this.volumeCtx = detail;
    this.dispatchEvent(new VolumeChangeEvent({ detail }));
  }

  getCurrentTime(): number {
    return this.context.currentTimeCtx;
  }

  setCurrentTime(detail: number): void {
    this.currentTimeCtx = detail;
    this.dispatchEvent(new TimeChangeEvent({ detail }));
  }

  getMuted(): boolean {
    return this.context.mutedCtx;
  }

  setMuted(detail: boolean): void {
    this.mutedCtx = detail;
    this.dispatchEvent(new MutedChangeEvent({ detail }));
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): string {
    return this.context.currentSrcCtx;
  }

  get currentPoster(): string {
    return this.context.currentPosterCtx;
  }

  get isPlaybackReady(): boolean {
    return this.context.isPlaybackReadyCtx;
  }

  get isPlaying(): boolean {
    return this.context.isPlayingCtx;
  }

  get engine(): unknown {
    return undefined;
  }

  get duration(): number {
    return this.context.durationCtx;
  }

  get buffered(): number {
    return this.context.bufferedCtx;
  }

  get isBuffering(): boolean {
    return this.context.isBufferingCtx;
  }

  get hasPlaybackStarted(): boolean {
    return this.context.hasPlaybackStartedCtx;
  }

  get hasPlaybackEnded(): boolean {
    return this.context.hasPlaybackEndedCtx;
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
    this.pausedCtx = false;
    this.dispatchEvent(new PlayEvent());
  }

  async pause(): Promise<void> {
    this.pausedCtx = true;
    this.dispatchEvent(new PauseEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------------------------

  render(): TemplateResult {
    return html`
      <div style="${styleMap(this.getContextStyleMap())}">
        <slot></slot>
      </div>
    `;
  }
}
