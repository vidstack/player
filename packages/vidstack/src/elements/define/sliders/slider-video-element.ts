import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { SliderVideo } from '../../../components';
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

  private _media!: MediaContext;
  private _video = this._createVideo();

  protected onSetup(): void {
    this._media = useMediaContext();
    this.$state.video.set(this._video);
  }

  protected onConnect(): void {
    const { crossorigin, canLoad } = this._media.$state,
      { src } = this.$state;

    if (this._video.parentNode !== this) {
      this.prepend(this._video);
    }

    effect(() => {
      setAttribute(this._video, 'src', src());
      setAttribute(this._video, 'crossorigin', crossorigin());
      setAttribute(this._video, 'preload', canLoad() ? 'auto' : 'none');
    });
  }

  private _createVideo() {
    return cloneTemplateContent<HTMLVideoElement>(videoTemplate);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-video': MediaSliderVideoElement;
  }
}
