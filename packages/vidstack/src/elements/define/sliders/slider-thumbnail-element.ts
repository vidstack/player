import { effect, useState, type StateContext } from 'maverick.js';
import { Slider } from '../../../components';
import { MediaThumbnailElement } from '../thumbnail-element';

/**
 * @example
 * ```html
 * <media-player >
 *   <media-time-slider>
 *     <media-slider-preview>
 *       <media-slider-thumbnail
 *         src="https://media-files.vidstack.io/thumbnails.vtt"
 *       ></media-slider-thumbnail>
 *     </media-slider-preview>
 *   </media-time-slider>
 * </media-player>
 * ```
 */
export class MediaSliderThumbnailElement extends MediaThumbnailElement {
  static override tagName = 'media-slider-thumbnail';

  private _slider!: StateContext<typeof Slider.state>;

  protected override onSetup(): void {
    super.onSetup();
    this._slider = useState(Slider.state);
  }

  protected override onConnect(): void {
    super.onConnect();
    effect(this._watchTime.bind(this));
  }

  private _watchTime() {
    const { duration } = this._media.$state;
    this.time = this._slider.pointerRate() * duration();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-thumbnail': MediaSliderThumbnailElement;
  }
}
