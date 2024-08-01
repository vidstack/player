import { Component, effect, prop, State, useState, type StateContext } from 'maverick.js';
import { EventsController, isNull, listenEvent, type DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaCrossOrigin } from '../../../core/api/types';
import { $ariaBool } from '../../../utils/aria';
import { Slider } from './slider/slider';

/**
 * Used to load a low-resolution video to be displayed when the user is hovering over or dragging
 * the time slider. The preview video will automatically be updated to be in-sync with the current
 * preview position, so ensure it has the same length as the original media (i.e., same duration).
 *
 * @attr data-loading - Whether the video is loading.
 * @attr data-error - Whether an error occurred loading video.
 * @attr data-hidden - Whether the video is not ready or has failed to load.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-video}
 */
export class SliderVideo extends Component<SliderVideoProps, SliderVideoState, SliderVideoEvents> {
  static props: SliderVideoProps = {
    src: null,
    crossOrigin: null,
  };

  static state = new State<SliderVideoState>({
    video: null,
    src: null,
    crossOrigin: null,
    canPlay: false,
    error: null,
    hidden: false,
  });

  #media!: MediaContext;
  #slider!: StateContext<typeof Slider.state>;

  @prop
  get video() {
    return this.$state.video();
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();
    this.#slider = useState(Slider.state);

    this.#watchCrossOrigin();

    this.setAttributes({
      'data-loading': this.#isLoading.bind(this),
      'data-hidden': this.$state.hidden,
      'data-error': this.#hasError.bind(this),
      'aria-hidden': $ariaBool(this.$state.hidden),
    });
  }

  protected override onAttach(el: HTMLElement) {
    effect(this.#watchVideo.bind(this));
    effect(this.#watchSrc.bind(this));
    effect(this.#watchCrossOrigin.bind(this));
    effect(this.#watchHidden.bind(this));

    effect(this.#onSrcChange.bind(this));
    effect(this.#onUpdateTime.bind(this));
  }

  #watchVideo() {
    const video = this.$state.video();

    if (!video) return;

    if (video.readyState >= 2) this.#onCanPlay();

    new EventsController(video)
      .add('canplay', this.#onCanPlay.bind(this))
      .add('error', this.#onError.bind(this));
  }

  #watchSrc() {
    const { src } = this.$state,
      { canLoad } = this.#media.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }

  #watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props,
      { crossOrigin: crossOriginState } = this.$state,
      { crossOrigin: mediaCrossOrigin } = this.#media.$state,
      crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? 'anonymous' : crossOrigin);
  }

  #isLoading() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }

  #hasError() {
    const { error } = this.$state;
    return !isNull(error);
  }

  #watchHidden() {
    const { src, hidden } = this.$state,
      { canLoad, duration } = this.#media.$state;
    hidden.set(canLoad() && (!src() || this.#hasError() || !Number.isFinite(duration())));
  }

  #onSrcChange() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }

  #onCanPlay(event?: Event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch('can-play', { trigger: event });
  }

  #onError(event: ErrorEvent) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch('error', { trigger: event });
  }

  #onUpdateTime() {
    const { video, canPlay } = this.$state,
      { duration } = this.#media.$state,
      { pointerRate } = this.#slider,
      media = video(),
      canUpdate =
        canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());

    if (canUpdate) {
      media!.currentTime = pointerRate() * duration();
    }
  }
}

export interface SliderVideoProps {
  /**
   * The URL of a media resource to use.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src}
   */
  src: string | null;
  /**
   * Defines how the media handles cross-origin requests, thereby enabling the
   * configuration of the CORS requests for the element's fetched data.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin}
   */
  crossOrigin: true | MediaCrossOrigin | null;
}

export interface SliderVideoState {
  video: HTMLVideoElement | null;
  src: string | null;
  crossOrigin: MediaCrossOrigin | null;
  canPlay: boolean;
  error: ErrorEvent | null;
  hidden: boolean;
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
  target: SliderVideo;
  /** The `canplay` media event. */
  readonly trigger: Event;
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
  target: SliderVideo;
  /** The `error` media event. */
  readonly trigger: Event;
}
