/* c8 ignore next 1000 */
import { html, TemplateResult } from 'lit-element';

import { CanPlay } from '../CanPlay';
import {
  VdsPauseEvent,
  VdsPlayEvent,
  VdsTimeUpdateEvent,
  VdsVolumeChangeEvent,
} from '../media/media.events';
import { MediaProviderElement } from '../provider/MediaProviderElement';

/**
 * A fake media provider that's used for testing. This class alone does nothing special. It can
 * be combined with Sinon spies/stubs/mocks to set the provider in the desired state.
 */
export class FakeMediaProviderElement extends MediaProviderElement {
  connectedCallback(): void {
    super.connectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Provider Metods
  // -------------------------------------------------------------------------------------------

  getCurrentTime(): number {
    return this.context.currentTime;
  }

  setCurrentTime(detail: number): void {
    this.context.currentTime = detail;
    this.dispatchEvent(new VdsTimeUpdateEvent({ detail }));
  }

  getMuted(): boolean {
    return this.context.muted;
  }

  setMuted(muted: boolean): void {
    this.context.muted = muted;
    this.dispatchEvent(
      new VdsVolumeChangeEvent({
        detail: {
          volume: this.context.volume,
          muted,
        },
      }),
    );
  }

  getPaused(): boolean {
    return this.context.paused;
  }

  getVolume(): number {
    return this.context.volume;
  }

  setVolume(volume: number): void {
    this.context.volume = volume;
    this.dispatchEvent(
      new VdsVolumeChangeEvent({
        detail: {
          volume,
          muted: this.context.muted,
        },
      }),
    );
  }

  // -------------------------------------------------------------------------------------------
  // Readonly Properties
  // -------------------------------------------------------------------------------------------

  get engine(): unknown {
    return undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Playback
  // -------------------------------------------------------------------------------------------

  canPlayType(): CanPlay {
    return CanPlay.No;
  }

  async play(): Promise<void> {
    this.context.paused = false;
    this.dispatchEvent(new VdsPlayEvent());
  }

  async pause(): Promise<void> {
    this.context.paused = true;
    this.dispatchEvent(new VdsPauseEvent());
  }

  // -------------------------------------------------------------------------------------------
  // Fullscreen
  // -------------------------------------------------------------------------------------------

  async requestFullscreen(): Promise<void> {
    this.context.fullscreen = true;
  }

  async exitFullscreen(): Promise<void> {
    this.context.fullscreen = false;
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
