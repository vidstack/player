import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import {
  SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  SLIDER_ELEMENT_TAG_NAME
} from './SliderElement.js';

export default {
  title: 'UI/Controls/Slider',
  component: SLIDER_ELEMENT_TAG_NAME,
  argTypes: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
 */
function Template({
  // Properties
  label,
  min = 0,
  max,
  step,
  keyboardStep,
  shiftKeyMultiplier,
  hidden,
  disabled,
  value,
  valueText,
  orientation,
  throttle,
  // Actions
  onSliderDragStart,
  onSliderDragEnd,
  onSliderValueChange
}) {
  return html`
    <vds-slider
      label=${ifNonEmpty(label)}
      max=${max}
      min=${min}
      orientation=${orientation}
      keyboard-step=${keyboardStep}
      shift-key-multiplier=${shiftKeyMultiplier}
      step=${step}
      throttle=${throttle}
      value-text=${ifNonEmpty(valueText)}
      value=${value}
      ?disabled=${disabled}
      ?hidden=${hidden}
      @vds-slider-drag-end=${onSliderDragEnd}
      @vds-slider-drag-start=${onSliderDragStart}
      @vds-slider-value-change=${onSliderValueChange}
    ></vds-slider>
  `;
}

export const Slider = Template.bind({});
