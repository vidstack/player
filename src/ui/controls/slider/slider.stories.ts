import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import {
  SLIDER_STORYBOOK_ARG_TYPES,
  SliderActions,
  SliderProps,
} from './slider.args';
import { SLIDER_TAG_NAME } from './vds-slider';

export default {
  title: 'UI/Foundation/Controls/Slider',
  component: SLIDER_TAG_NAME,
  argTypes: SLIDER_STORYBOOK_ARG_TYPES,
};

const Template: Story<SliderProps & SliderActions> = ({
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
      label="${ifNonEmpty(label)}"
      min="${min}"
      max="${max}"
      step="${step}"
      step-ratio="${stepRatio}"
      value="${value}"
      value-text="${ifNonEmpty(valueText)}"
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
