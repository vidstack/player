import { useStore, type StoreContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';

import { useMedia, type MediaContext } from '../../core/api/context';
import { Thumbnail } from '../thumbnail';
import { SliderStoreFactory } from './slider/api/store';

declare global {
  interface MaverickElements {
    'media-slider-thumbnail': MediaSliderThumbnailElement;
  }
}

/**
 * Used to display preview thumbnails when the user is hovering or dragging the time slider.
 * The time ranges in the WebVTT file will automatically be matched based on the current slider
 * pointer position.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider-thumbnail}
 * @example
 * ```html
 * <media-player thumbnails="https://media-files.vidstack.io/thumbnails.vtt">
 *   <media-time-slider>
 *     <media-slider-thumbnail slot="preview"></media-slider-thumbnail>
 *   </media-time-slider>
 * </media-player>
 * ```
 */
export class SliderThumbnail extends Component<SliderThumbnailAPI> {
  static el = defineElement<SliderThumbnailAPI>({
    tagName: 'media-slider-thumbnail',
  });

  static register = [Thumbnail];

  protected _media!: MediaContext;
  protected _slider!: StoreContext<typeof SliderStoreFactory>;

  constructor(instance: ComponentInstance<SliderThumbnailAPI>) {
    super(instance);
    this._media = useMedia();
    this._slider = useStore(SliderStoreFactory);
  }

  protected _getTime() {
    const { duration } = this._media.$store;
    return this._slider.pointerRate() * duration();
  }

  override render() {
    const time = this._getTime.bind(this);
    return <media-thumbnail part="thumbnail" time={time()}></media-thumbnail>;
  }
}

export interface SliderThumbnailAPI {}

export interface MediaSliderThumbnailElement extends HTMLCustomElement<SliderThumbnail> {}
