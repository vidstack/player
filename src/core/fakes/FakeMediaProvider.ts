/* c8 ignore next 1000 */
import { html, property, TemplateResult } from 'lit-element';

import { CanPlayType } from '../CanPlayType';
import { playerContext } from '../player.context';
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
      this.dispatchEvent(new PlaybackReadyEvent());
    }
  }

  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getPaused(): boolean {
    return true;
  }

  getVolume(): number {
    return 1;
  }

  setVolume(detail: number): void {
    this.dispatchEvent(new VolumeChangeEvent({ detail }));
  }

  getCurrentTime(): number {
    return 0;
  }

  setCurrentTime(detail: number): void {
    this.dispatchEvent(new TimeChangeEvent({ detail }));
  }

  getMuted(): boolean {
    return false;
  }

  setMuted(detail: boolean): void {
    this.dispatchEvent(new MutedChangeEvent({ detail }));
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
    return this.playbackReady;
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
    return html`<div><slot></slot></div>`;
  }
}
