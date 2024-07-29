import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { SliderVideo } from '../../../components/ui/sliders/slider-video';
import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { cloneTemplateContent, createTemplate } from '../../../utils/dom';

const videoTemplate = /* #__PURE__*/ createTemplate(
  `<video muted playsinline preload="none" style="max-width: unset;"></video>`,
);

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/slider-video}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-preview>
 *     <media-slider-video src="/low-res-video.mp4"></media-slider-video>
 *   </media-slider-preview>
 * </media-time-slider>
 * ```
 */
export class MediaSliderVideoElement extends Host(HTMLElement, SliderVideo) {
  static tagName = 'media-slider-video';

  #media!: MediaContext;
  #video = this.#createVideo();

  protected onSetup(): void {
    this.#media = useMediaContext();
    this.$state.video.set(this.#video);
  }

  protected onConnect(): void {
    const { canLoad } = this.#media.$state,
      { src, crossOrigin } = this.$state;

    if (this.#video.parentNode !== this) {
      this.prepend(this.#video);
    }

    effect(() => {
      setAttribute(this.#video, 'crossorigin', crossOrigin());
      setAttribute(this.#video, 'preload', canLoad() ? 'auto' : 'none');
      setAttribute(this.#video, 'src', src());
    });
  }

  #createVideo() {
    return cloneTemplateContent<HTMLVideoElement>(videoTemplate);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-video': MediaSliderVideoElement;
  }
}
