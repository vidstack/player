import { Component, effect, prop, State, useState, type StateContext } from 'maverick.js';
import { listenEvent, type DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { $ariaBool } from '../../../utils/aria';
import { Slider } from './slider/slider';

/**
 * Used to load a low-resolution video to be displayed when the user is hovering over or dragging
 * the time slider. The preview video will automatically be updated to be in-sync with the current
 * preview position, so ensure it has the same length as the original media (i.e., same duration).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-video}
 */
export class SliderVideo extends Component<SliderVideoProps, SliderVideoState, SliderVideoEvents> {
  static props: SliderVideoProps = {
    src: null,
  };

  static state = new State<SliderVideoState>({
    video: null,
    src: null,
    canPlay: false,
    error: false,
    hidden: true,
  });

  private _media!: MediaContext;
  private _slider!: StateContext<typeof Slider.state>;

  @prop
  get video() {
    return this.$state.video();
  }

  protected override onSetup(): void {
    this._media = useMediaContext();
    this._slider = useState(Slider.state);
    this.setAttributes({
      'data-loading': this._isLoading.bind(this),
      'aria-hidden': $ariaBool(this.$state.hidden),
    });
  }

  protected override onAttach(el: HTMLElement) {
    effect(this._watchVideo.bind(this));
    effect(this._watchSrc.bind(this));
    effect(this._watchHidden.bind(this));

    effect(this._onSrcChange.bind(this));
    effect(this._onUpdateTime.bind(this));
  }

  private _watchVideo() {
    const video = this.$state.video();

    if (!video) return;

    if (video.readyState >= 2) this._onCanPlay();
    listenEvent(video, 'canplay', this._onCanPlay.bind(this));
    listenEvent(video, 'error', this._onError.bind(this));
  }

  private _watchSrc() {
    const { src } = this.$state,
      { canLoad } = this._media.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }

  private _isLoading() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }

  private _watchHidden() {
    const { hidden, canPlay, error } = this.$state,
      { duration } = this._media.$state;
    hidden.set(!!error() || !canPlay() || !Number.isFinite(duration()));
  }

  private _onSrcChange() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(false);
  }

  private _onCanPlay(event?: Event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(false);
    this.dispatch('can-play', { trigger: event });
  }

  private _onError(event?: Event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(true);
    this.dispatch('error', { trigger: event });
  }

  private _onUpdateTime() {
    const { video, canPlay } = this.$state,
      { duration } = this._media.$state,
      { pointerRate } = this._slider;
    if (canPlay() && video() && Number.isFinite(duration()) && Number.isFinite(pointerRate())) {
      video()!.currentTime = pointerRate() * duration();
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
}

export interface SliderVideoState {
  video: HTMLVideoElement | null;
  src: string | null;
  canPlay: boolean;
  error: boolean;
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
  target: SliderVideo;
  /** The `error` media event. */
  trigger: Event;
}
