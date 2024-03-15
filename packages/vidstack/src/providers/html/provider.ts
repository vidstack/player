import { createScope, onDispose } from 'maverick.js';
import { isString, setAttribute } from 'maverick.js/std';

import type { MediaContext } from '../../core/api/media-context';
import type { HTMLMediaSrc, Src } from '../../core/api/src-types';
import { isMediaStream } from '../../utils/mime';
import type { MediaProviderAdapter } from '../types';
import { AudioGain } from './audio/audio-gain';
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

  protected _currentSrc: Src<HTMLMediaSrc> | null = null;

  readonly audioGain = new AudioGain(this._media, (gain) => {
    this._ctx.delegate._notify('audio-gain-change', gain);
  });

  constructor(
    protected _media: HTMLMediaElement,
    protected _ctx: MediaContext,
  ) {}

  setup() {
    new HTMLMediaEvents(this, this._ctx);

    if ('audioTracks' in this.media) new NativeAudioTracks(this, this._ctx);

    onDispose(() => {
      this.audioGain.destroy();

      // We need to remove all media sources incase another provider uses the same media element.
      this._media.srcObject = null;
      this._media.removeAttribute('src');
      for (const source of this._media.querySelectorAll('source')) source.remove();

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

  async loadSource({ src, type }: Src, preload?: HTMLMediaElement['preload']) {
    this._media.preload = preload || '';

    if (isMediaStream(src)) {
      this._removeSource();
      this._media.srcObject = src;
    } else {
      this._media.srcObject = null;
      if (isString(src)) {
        if (type !== '?') {
          this._appendSource({ src, type });
        } else {
          this._removeSource();
          this._media.src = this._appendMediaFragment(src);
        }
      } else {
        this._removeSource();
        this._media.src = window.URL.createObjectURL(src as MediaSource | Blob);
      }
    }

    this._media.load();
    this._currentSrc = { src: src as HTMLMediaSrc, type };
  }

  /**
   * Append source so it works when requesting AirPlay since hls.js will remove it.
   */
  protected _appendSource(src: Src<string>, defaultType?: string) {
    const prevSource = this._media.querySelector('source[data-vds]'),
      source = prevSource ?? document.createElement('source');

    setAttribute(source, 'src', this._appendMediaFragment(src.src));
    setAttribute(source, 'type', src.type !== '?' ? src.type : defaultType);
    setAttribute(source, 'data-vds', '');

    if (!prevSource) this._media.append(source);
  }

  protected _removeSource() {
    this._media.querySelector('source[data-vds]')?.remove();
  }

  protected _appendMediaFragment(src: string) {
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
