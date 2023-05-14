import {
  computed,
  effect,
  signal,
  useStore,
  type ReadSignal,
  type StoreContext,
} from 'maverick.js';
import { Component, defineElement, type HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import { $ariaBool } from '../../../utils/aria';
import { useMedia, type MediaContext } from '../../core/api/context';
import { SliderStoreFactory } from './slider/api/store';

declare global {
  interface MaverickElements {
    'media-slider-video': MediaSliderVideoElement;
  }
}

/**
 * Used to load a low-resolution video to be displayed when the user is hovering over or dragging
 * the time slider. The preview video will automatically be updated to be in-sync with the current
 * preview position, so ensure it has the same length as the original media (i.e., same duration).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-video}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-video src="/low-res-video.mp4" slot="preview"></media-slider-video>
 * </media-time-slider>
 * ```
 */
export class SliderVideo extends Component<SliderVideoAPI> {
  static el = defineElement<SliderVideoAPI>({
    tagName: 'media-slider-video',
    props: { src: undefined },
  });

  protected _media!: MediaContext;
  protected _slider!: StoreContext<typeof SliderStoreFactory>;
  protected _video: HTMLVideoElement | null = null;

  protected _canPlay = signal(false);
  protected _error = signal(false);
  protected _src!: ReadSignal<string | null | undefined>;
  protected _hidden!: ReadSignal<boolean>;

  protected override onAttach() {
    this._media = useMedia();
    this._slider = useStore(SliderStoreFactory);

    this._src = computed(this._getSrc.bind(this));
    this._hidden = computed(this._isHidden.bind(this));

    this.setAttributes({
      'data-loading': this._isLoading.bind(this),
      'aria-hidden': $ariaBool(this._hidden),
    });

    effect(this._onSrcChange.bind(this));
    effect(this._onTimeUpdate.bind(this));
  }

  protected override onConnect() {
    if (this._video!.readyState >= 2) this._onCanPlay();
  }

  override render() {
    const { crossorigin } = this._media.$store;
    return (
      <video
        muted
        playsinline
        preload="auto"
        src={this._src()}
        crossorigin={crossorigin()}
        part="video"
        $on:canplay={this._onCanPlay.bind(this)}
        $on:error={this._onError.bind(this)}
        $ref={this._setVideo.bind(this)}
        style="max-width: unset;"
      ></video>
    );
  }

  protected _getSrc() {
    const { canLoad } = this._media.$store;
    return canLoad() ? this.$props.src() : null;
  }

  protected _isLoading() {
    return !this._canPlay() && !this._hidden();
  }

  protected _isHidden() {
    const { duration } = this._media.$store;
    return !!this._error() || !this._canPlay() || !Number.isFinite(duration());
  }

  protected _onSrcChange() {
    this._src();
    this._canPlay.set(false);
    this._error.set(false);
  }

  protected _onCanPlay(event?: Event) {
    this._canPlay.set(true);
    this.dispatch('can-play', { trigger: event });
  }

  protected _onError(event?: Event) {
    this._error.set(true);
    this.dispatch('error', { trigger: event });
  }

  protected _onTimeUpdate() {
    const { duration } = this._media.$store;
    const { pointerRate } = this._slider;
    if (
      this._canPlay() &&
      this._video &&
      Number.isFinite(duration()) &&
      Number.isFinite(pointerRate())
    ) {
      this._video.currentTime = pointerRate() * duration();
    }
  }

  protected _setVideo(el: HTMLVideoElement | null) {
    this._video = el;
  }
}

export interface MediaSliderVideoElement extends HTMLCustomElement<SliderVideo> {}

export interface SliderVideoAPI {
  props: SliderVideoProps;
  events: SliderVideoEvents;
}

export interface SliderVideoProps {
  /**
   * The URL of a media resource to use.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src}
   */
  src: string | undefined;
}

export interface SliderVideoEvents {
  'can-play': SliderVideoCanPlayEvent;
  error: SliderVideoErrorEvent;
}

/**
 * Fired when the user agent can play the media, but estimates that **not enough** data has been
 * loaded to play the media up to its end without having to stop for further buffering of content.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event}
 */
export interface SliderVideoCanPlayEvent extends DOMEvent<void> {
  /** The `canplay` media event. */
  trigger?: Event;
}

/**
 * Fired when media loading or playback has encountered any issues (for example, a network
 * connectivity problem). The event detail contains a potential message containing more
 * information about the error (empty string if nothing available), and a code that identifies
 * the general type of error that occurred.
 *
 * @see {@link https://html.spec.whatwg.org/multipage/media.html#error-codes}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event}
 */
export interface SliderVideoErrorEvent extends DOMEvent<void> {
  /** The `error` media event. */
  trigger: Event;
}
