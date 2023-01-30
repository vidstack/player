import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

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
  trigger: Event;
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

/**
 * Used to load a low-resolution video to be displayed when the user is hovering or dragging
 * the slider. The point at which they're hovering or dragging (`pointerValue`) is the preview
 * time position. The video will automatically be updated to match, so ensure it's of the same
 * length as the original.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-video}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-video src="/low-res-video.mp4" slot="preview"></media-slider-video>
 * </media-time-slider>
 * ```
 */
export interface MediaSliderVideoElement
  extends HTMLCustomElement<SliderVideoProps, SliderVideoEvents> {}
