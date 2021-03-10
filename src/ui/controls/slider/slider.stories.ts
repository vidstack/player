import './vds-slider';

import { html } from 'lit-element';

import { Story } from '../../../shared/storybook';
import { SLIDER_ARG_TYPES, SliderArgTypes } from './slider.args';

export default {
  title: 'UI/Foundation/Slider',
  component: 'vds-slider',
  argTypes: SLIDER_ARG_TYPES,
};

const Template: Story<SliderArgTypes> = ({
  label,
  min = 0,
  max,
  step,
  stepRatio,
  hidden,
  disabled,
  value,
  valueText,
  orientation,
  throttle,
  onValueChange,
  onDragStart,
  onDragEnd,
}) =>
  html`
    <vds-slider
      label="${label}"
      min="${min}"
      max="${max}"
      step="${step}"
      step-ratio="${stepRatio}"
      value="${value}"
      value-text="${valueText}"
      orientation="${orientation}"
      throttle="${throttle}"
      ?disabled="${disabled}"
      ?hidden="${hidden}"
      @vds-slider-value-change="${onValueChange}"
      @vds-slider-drag-start="${onDragStart}"
      @vds-slider-drag-end="${onDragEnd}"
      style="max-width: 25%;"
    ></vds-slider>
  `;

export const Slider = Template.bind({});
