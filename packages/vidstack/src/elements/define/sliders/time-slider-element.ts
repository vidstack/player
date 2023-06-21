import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { TimeSlider } from '../../../components';
import { cloneTemplate } from '../../../utils/dom';

/**
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/time-slider}
 * @example
 * ```html
 * <media-time-slider>
 *   <div class="slider-track"></div>
 *   <div class="slider-track-fill"></div>
 *   <div class="slider-track-progress"></div>
 *   <div class="slider-thumb"></div>
 * </media-time-slider>
 * ```
 * @example
 * ```html
 * <media-time-slider>
 *   <div class="slider-chapters">
 *     <template>
 *       <div class="slider-chapter">
 *         <div class="slider-track"></div>
 *         <div class="slider-track-fill"></div>
 *         <div class="slider-track-progress"></div>
 *       </div>
 *     </template>
 *   </div>
 *   <div class="slider-thumb"></div>
 * </media-time-slider>
 * ```
 * @example
 * ```html
 * <media-time-slider>
 *   <!-- ... -->
 *   <media-slider-preview>
 *     <media-slider-value type="pointer" format="time"></media-slider-value>
 *   <media-slider-preview>
 * </media-time-slider>
 * ```
 */
export class MediaTimeSliderElement extends Host(HTMLElement, TimeSlider) {
  static tagName = 'media-time-slider';

  protected _chapterTemplate: HTMLTemplateElement | null = null;

  protected onConnect(): void {
    const template = this.querySelector('template') as HTMLTemplateElement | null;
    if (template) {
      this._chapterTemplate = template;
      effect(this._renderTemplate.bind(this));
    }
  }

  private _renderTemplate() {
    if (!this._chapterTemplate) return;
    const elements = cloneTemplate(this._chapterTemplate, this.chapters.cues.length || 1);
    this.chapters.addRefs(elements);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-time-slider': MediaTimeSliderElement;
  }
}
