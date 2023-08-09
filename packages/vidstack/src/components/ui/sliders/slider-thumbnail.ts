import { useState, type StateContext } from 'maverick.js';
import { Thumbnail } from '../thumbnails/thumbnail';
import { sliderState } from './slider/api/state';
import { Slider } from './slider/slider';

/**
 * Used to display preview thumbnails when the user is hovering or dragging the time slider.
 * The time ranges in the WebVTT file will automatically be matched based on the current slider
 * pointer position.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-thumbnail}
 */
export class SliderThumbnail extends Thumbnail {
  private _slider!: StateContext<typeof sliderState>;

  protected override onAttach(el: HTMLElement) {
    this._slider = useState(Slider.state);
  }

  protected override _getTime() {
    const { duration } = this._media.$state;
    return this._slider.pointerRate() * duration();
  }
}
