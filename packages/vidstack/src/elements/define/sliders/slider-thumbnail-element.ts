import { effect, useState, type StateContext } from 'maverick.js';

import { Slider } from '../../../components/ui/sliders/slider/slider';
import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { MediaThumbnailElement } from '../thumbnail-element';

/**
 * @example
 * ```html
 * <media-player >
 *   <media-time-slider>
 *     <media-slider-preview>
 *       <media-slider-thumbnail
 *         src="https://files.vidstack.io/thumbnails.vtt"
 *       ></media-slider-thumbnail>
 *     </media-slider-preview>
 *   </media-time-slider>
 * </media-player>
 * ```
 */
export class MediaSliderThumbnailElement extends MediaThumbnailElement {
  static override tagName = 'media-slider-thumbnail';

  #media!: MediaContext;
  #slider!: StateContext<typeof Slider.state>;

  protected override onSetup(): void {
    super.onSetup();
    this.#media = useMediaContext();
    this.#slider = useState(Slider.state);
  }

  protected override onConnect(): void {
    super.onConnect();
    effect(this.#watchTime.bind(this));
  }

  #watchTime() {
    const { duration, clipStartTime } = this.#media.$state;
    this.time = clipStartTime() + this.#slider.pointerRate() * duration();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-thumbnail': MediaSliderThumbnailElement;
  }
}
