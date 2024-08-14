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

  currentSrc: Src<HTMLMediaSrc> | null = null;

  readonly audioGain: AudioGain;

  constructor(
    readonly media: HTMLMediaElement,
    protected readonly ctx: MediaContext,
  ) {
    this.audioGain = new AudioGain(media, (gain) => {
      this.ctx.notify('audio-gain-change', gain);
    });
  }

  setup() {
    new HTMLMediaEvents(this, this.ctx);

    if ('audioTracks' in this.media) new NativeAudioTracks(this, this.ctx);

    onDispose(() => {
      this.audioGain.destroy();

      // We need to remove all media sources incase another provider uses the same media element.
      this.media.srcObject = null;
      this.media.removeAttribute('src');
      for (const source of this.media.querySelectorAll('source')) source.remove();

      this.media.load();
    });
  }

  get type() {
    return '';
  }

  setPlaybackRate(rate: number) {
    this.media.playbackRate = rate;
  }

  async play() {
    return this.media.play();
  }

  async pause() {
    return this.media.pause();
  }

  setMuted(muted: boolean) {
    this.media.muted = muted;
  }

  setVolume(volume: number) {
    this.media.volume = volume;
  }

  setCurrentTime(time: number) {
    this.media.currentTime = time;
  }

  setPlaysInline(inline: boolean) {
    setAttribute(this.media, 'playsinline', inline);
  }

  async loadSource({ src, type }: Src, preload?: HTMLMediaElement['preload']) {
    this.media.preload = preload || '';

    if (isMediaStream(src)) {
      this.removeSource();
      this.media.srcObject = src;
    } else {
      this.media.srcObject = null;
      if (isString(src)) {
        if (type !== '?') {
          this.appendSource({ src, type });
        } else {
          this.removeSource();
          this.media.src = this.#appendMediaFragment(src);
        }
      } else {
        this.removeSource();
        this.media.src = window.URL.createObjectURL(src as MediaSource | Blob);
      }
    }

    this.media.load();
    this.currentSrc = { src: src as HTMLMediaSrc, type };
  }

  /**
   * Append source so it works when requesting AirPlay since hls.js will remove it.
   */
  protected appendSource(src: Src<string>, defaultType?: string) {
    const prevSource = this.media.querySelector('source[data-vds]'),
      source = prevSource ?? document.createElement('source');

    setAttribute(source, 'src', this.#appendMediaFragment(src.src));
    setAttribute(source, 'type', src.type !== '?' ? src.type : defaultType);
    setAttribute(source, 'data-vds', '');

    if (!prevSource) this.media.append(source);
  }

  protected removeSource() {
    this.media.querySelector('source[data-vds]')?.remove();
  }

  #appendMediaFragment(src: string) {
    const { clipStartTime, clipEndTime } = this.ctx.$state,
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
