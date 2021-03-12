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
  /***
   * Trigger playback ready event when it mounts.
   */
  @property({ type: Boolean, attribute: 'playback-ready' })
  playbackReady = false;

  connectedCallback(): void {
    super.connectedCallback();

    if (this.playbackReady) {
      this.playerContext.isPlaybackReadyCtx = true;
      this.dispatchEvent(new PlaybackReadyEvent());
    }
  }

  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getPaused(): boolean {
    return this.playerContext.pausedCtx;
  }

  getVolume(): number {
    return this.playerContext.volumeCtx;
  }

  setVolume(detail: number): void {
    this.dispatchEvent(new VolumeChangeEvent({ detail }));
  }

  getCurrentTime(): number {
    return this.playerContext.currentTimeCtx;
  }

  setCurrentTime(detail: number): void {
    this.dispatchEvent(new TimeChangeEvent({ detail }));
  }

  getMuted(): boolean {
    return this.playerContext.mutedCtx;
  }

  setMuted(detail: boolean): void {
    this.dispatchEvent(new MutedChangeEvent({ detail }));
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get currentSrc(): string {
    return this.playerContext.currentSrcCtx;
  }

  get currentPoster(): string {
    return this.playerContext.currentPosterCtx;
  }

  get isPlaybackReady(): boolean {
    return this.playerContext.isPlaybackReadyCtx;
  }

  get isPlaying(): boolean {
    return this.playerContext.isPlayingCtx;
  }

  get engine(): unknown {
    return undefined;
  }

  get duration(): number {
    return this.playerContext.durationCtx;
  }

  get buffered(): number {
    return this.playerContext.bufferedCtx;
  }

  get isBuffering(): boolean {
    return this.playerContext.isBufferingCtx;
  }

  get hasPlaybackStarted(): boolean {
    return this.playerContext.hasPlaybackStartedCtx;
  }

  get hasPlaybackEnded(): boolean {
    return this.playerContext.hasPlaybackEndedCtx;
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
    this.dispatchEvent(new PlayEvent());
  }

  async pause(): Promise<void> {
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
