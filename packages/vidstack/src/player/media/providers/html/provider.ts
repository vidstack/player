import { setAttribute } from 'maverick.js/std';

import type { MediaProvider, MediaProviderContext } from '../types';
import { useHTMLMediaElementEvents } from './use-events';

/**
 * This HTML media provider adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider interface.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export class HTMLMediaProvider implements MediaProvider {
  constructor(protected _media: HTMLMediaElement) {}

  setup(context: MediaProviderContext) {
    useHTMLMediaElementEvents(this, context);
  }

  get media() {
    return this._media;
  }

  get paused() {
    return this._media.paused;
  }

  get muted() {
    return this._media.muted;
  }

  set muted(muted) {
    this._media.muted = muted;
  }

  get volume() {
    return this._media.volume;
  }

  set volume(volume) {
    this._media.volume = volume;
  }

  get currentTime() {
    return this._media.currentTime;
  }

  set currentTime(time) {
    this._media.currentTime = time;
  }

  get playsinline() {
    return this._media.hasAttribute('playsinline');
  }

  set playsinline(playsinline) {
    setAttribute(this._media, 'playsinline', playsinline);
  }

  async play() {
    return this._media.play();
  }

  async pause() {
    return this._media.pause();
  }

  async loadSource(src, preload) {
    this._media.src = src.src;
    this._media.preload = preload;
    this._media.load();
  }
}
