import { effect } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { SliderChapters } from '../../../components';
import { cloneTemplate, requestScopedAnimationFrame } from '../../../utils/dom';

/**
 * @part chapter-title - Contains the current chapter title.
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/slider-chapters}
 * @example
 * ```html
 * <media-time-slider>
 *   <media-slider-chapters>
 *     <template>
 *       <div class="slider-chapter">
 *         <div class="slider-track"></div>
 *         <div class="slider-track-fill"></div>
 *         <div class="slider-track-progress"></div>
 *       </div>
 *     </template>
 *   </media-slider-chapters>
 * </media-time-slider>
 * ```
 */
export class MediaSliderChaptersElement extends Host(HTMLElement, SliderChapters) {
  static tagName = 'media-slider-chapters';

  protected _template: HTMLTemplateElement | null = null;

  protected onConnect(): void {
    // Animation frame required as some frameworks append late for some reason.
    requestScopedAnimationFrame(() => {
      if (!this.connectScope) return;
      const template = this.querySelector('template') as HTMLTemplateElement | null;
      if (template) {
        this._template = template;
        effect(this._renderTemplate.bind(this));
      }
    });
  }

  private _renderTemplate() {
    if (!this._template) return;
    const elements = cloneTemplate(this._template, this.cues.length || 1);
    this.setRefs(elements);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-chapters': MediaSliderChaptersElement;
  }
}
