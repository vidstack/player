import { html } from 'lit-element';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { Story } from '../../../shared/storybook';
import { SLIDER_STORYBOOK_ARG_TYPES } from './slider.args';
import { SliderActions, SliderProps } from './slider.types';
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
  stepMultiplier,
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
      step-multiplier="${stepMultiplier}"
      value="${value}"
      value-text="${ifNonEmpty(valueText)}"
      orientation="${orientation}"
      throttle="${throttle}"
      ?disabled="${disabled}"
      ?hidden="${hidden}"
      @vds-slidervaluechange="${onValueChange}"
      @vds-sliderdragstart="${onDragStart}"
      @vds-sliderdragend="${onDragEnd}"
      style="max-width: 25%;"
    ></vds-slider>
  `;

export const Slider = Template.bind({});
