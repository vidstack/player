import { MediaProvider, MediaType, ViewType } from '../../core';

export class MediaFileProvider extends MediaProvider {
  protected mediaEl?: HTMLMediaElement;

  getVolume(): number {
    // ...
  }

  setVolume(newVolume: number): void {
    // ..
  }

  getCurrentTime(): number {
    // ..
  }

  setCurrentTime(newTime: number): void {
    // ..
  }

  isMuted(): boolean {
    // ..
  }

  setMuted(isMuted: boolean): void {
    // ..
  }

  isControlsVisible(): boolean {
    // ..
  }

  setControlsVisibility(isVisible: boolean): void {
    // ..
  }

  getPoster(): string | undefined {
    // ..
  }

  setPoster(newPoster: string | undefined): void {
    // ..
  }

  isReady(): boolean {
    // ..
  }

  isPlaybackReady(): boolean {
    // ..
  }

  isPaused(): boolean {
    // ..
  }

  getCurrentSrc(): string {
    // ..
  }

  getInternalPlayer(): unknown {
    // ..
  }

  getViewType(): ViewType {
    // ..
  }

  getMediaType(): MediaType {
    // ..
  }

  getDuration(): number {
    // ..
  }

  getBuffered(): number {
    // ..
  }

  isBuffering(): boolean {
    // ..
  }

  hasPlaybackStarted(): boolean {
    // ..
  }

  hasPlaybackEnded(): boolean {
    // ..
  }

  canPlayType(type: string): boolean {
    // ..
  }

  play(): Promise<void> {
    // ..
  }

  pause(): Promise<void> {
    // ..
  }
}
