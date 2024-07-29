import { Component, effect, useState } from 'maverick.js';
import { Host } from 'maverick.js/element';

import { sliderState } from '../../../components/ui/sliders/slider/api/state';
import { cloneTemplate, requestScopedAnimationFrame } from '../../../utils/dom';

class SliderSteps extends Component {}

/**
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/sliders/slider-steps}
 * @example
 * ```html
 * <media-slider>
 *   <media-slider-steps>
 *     <template>
 *       <div class="slider-step"></div>
 *     </template>
 *   </media-slider-steps>
 * </media-slider>
 * ```
 */
export class MediaSliderStepsElement extends Host(HTMLElement, SliderSteps) {
  static tagName = 'media-slider-steps';

  #template: HTMLTemplateElement | null = null;

  onConnect(el: HTMLElement) {
    // Animation frame required as some frameworks append late for some reason.
    requestScopedAnimationFrame(() => {
      if (!this.connectScope) return;
      this.#template = el.querySelector('template');
      if (this.#template) effect(this.#render.bind(this));
    });
  }

  #render() {
    if (!this.#template) return;

    const { min, max, step } = useState(sliderState),
      steps = (max() - min()) / step();

    cloneTemplate(this.#template, Math.floor(steps) + 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-slider-steps': MediaSliderStepsElement;
  }
}
