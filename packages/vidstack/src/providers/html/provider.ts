import { createScope, onDispose } from 'maverick.js';
import { isString, setAttribute } from 'maverick.js/std';

import type { MediaSrc } from '../../core/api/types';
import { isMediaStream } from '../../utils/mime';
import type { MediaProviderAdapter, MediaSetupContext } from '../types';
import { HTMLMediaEvents } from './html–media-events';
import { NativeAudioTracks } from './native-audio-tracks';

/**
 * This HTML media provider adapts the underlying media element such as `<audio>` or `<video>` to
 * satisfy the media provider interface.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement}
 */
export class HTMLMediaProvider implements MediaProviderAdapter {
  readonly scope = createScope();

  protected _currentSrc: MediaSrc | null = null;

  constructor(protected _media: HTMLMediaElement) {}

  setup(context: MediaSetupContext) {
    new HTMLMediaEvents(this, context);
    if ('audioTracks' in this.media) new NativeAudioTracks(this, context);
    this.playsinline = context.$state.playsinline();
    onDispose(() => {
      // Dispose of media.
      this._media.setAttribute('src', '');
      this._media.load();
    });
  }

  get type() {
    return '';
  }

  get media() {
    return this._media;
  }

  get currentSrc() {
    return this._currentSrc;
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

  get playbackRate() {
    return this._media.playbackRate;
  }

  set playbackRate(rate) {
    this._media.playbackRate = rate;
  }

  async play() {
    return this._media.play();
  }

  async pause() {
    return this._media.pause();
  }

  async loadSource({ src, type }: MediaSrc, preload?: HTMLMediaElement['preload']) {
    this._media.preload = preload || '';

    if (isMediaStream(src)) {
      this._media.srcObject = src;
    } else {
      this._media.srcObject = null;
      this._media.src = isString(src) ? src : window.URL.createObjectURL(src);
    }

    this._media.load();
    this._currentSrc = { src, type };
  }
}
