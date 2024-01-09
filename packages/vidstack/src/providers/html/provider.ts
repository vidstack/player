import { createScope, onDispose } from 'maverick.js';
import { isString, setAttribute } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { MediaResource, MediaSrc } from '../../core/api/types';
import { isMediaStream } from '../../utils/mime';
import type { MediaProviderAdapter } from '../types';
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

  protected _currentSrc: MediaSrc<MediaResource> | null = null;

  constructor(
    protected _media: HTMLMediaElement,
    protected _ctx: MediaContext,
  ) {}

  setup() {
    new HTMLMediaEvents(this, this._ctx);

    if ('audioTracks' in this.media) new NativeAudioTracks(this, this._ctx);

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

  setPlaybackRate(rate: number) {
    this._media.playbackRate = rate;
  }

  async play() {
    return this._media.play();
  }

  async pause() {
    return this._media.pause();
  }

  setMuted(muted: boolean) {
    this._media.muted = muted;
  }

  setVolume(volume: number) {
    this._media.volume = volume;
  }

  setCurrentTime(time: number) {
    this._media.currentTime = time;
  }

  setPlaysInline(inline: boolean) {
    setAttribute(this._media, 'playsinline', inline);
  }

  async loadSource({ src, type }: MediaSrc, preload?: HTMLMediaElement['preload']) {
    this._media.preload = preload || '';

    if (isMediaStream(src)) {
      this._media.srcObject = src;
    } else {
      this._media.srcObject = null;
      this._media.src = isString(src)
        ? this._appendMediaFragment(src)
        : window.URL.createObjectURL(src as MediaSource | Blob);
    }

    this._media.load();

    this._currentSrc = {
      src: src as MediaResource,
      type,
    };
  }

  private _appendMediaFragment(src: string) {
    const { clipStartTime, clipEndTime } = this._ctx.$state,
      startTime = clipStartTime(),
      endTime = clipEndTime();

    if (startTime > 0 && endTime > 0) {
      return `${src}#t=${startTime},${endTime}`;
    } else if (startTime > 0) {
      return `${src}#t=${startTime}`;
    } else if (endTime > 0) {
      return `${src}#t=0,${endTime}`;
    }

    return src;
  }
}
