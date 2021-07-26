import './define';

import { ifNonEmpty, on } from '@base/directives/index';
import { storybookAction, StorybookControl } from '@base/storybook/index';
import { html } from 'lit';

import { SLIDER_ELEMENT_TAG_NAME } from './SliderElement';

export const SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  disabled: { control: StorybookControl.Boolean, defaultValue: false },
  hidden: { control: StorybookControl.Boolean, defaultValue: false },
  label: { control: StorybookControl.Text },
  max: { control: StorybookControl.Number, defaultValue: 100 },
  min: { control: StorybookControl.Number, defaultValue: 0 },
  orientation: {
    control: StorybookControl.Select,
    options: ['horizontal', 'vertical'],
    defaultValue: 'horizontal'
  },
  step: {
    control: StorybookControl.Number,
    defaultValue: 1
  },
  keyboardStep: {
    control: StorybookControl.Number,
    defaultValue: 1
  },
  shiftKeyMultiplier: {
    control: StorybookControl.Number,
    defaultValue: 5
  },
  value: { control: StorybookControl.Number, defaultValue: 50 },
  valueText: { control: StorybookControl.Text },
  onSliderDragStart: storybookAction('vds-slider-drag-start'),
  onSliderDragEnd: storybookAction('vds-slider-drag-end'),
  onSliderValueChange: storybookAction('vds-slider-value-change')
};

export default {
  title: 'UI/Controls/Slider',
  component: SLIDER_ELEMENT_TAG_NAME,
  argTypes: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

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
  // Actions
  onSliderDragStart,
  onSliderDragEnd,
  onSliderValueChange
}: any) {
  return html`
    <vds-slider
      keyboard-step=${keyboardStep}
      label=${ifNonEmpty(label)}
      max=${max}
      min=${min}
      orientation=${orientation}
      shift-key-multiplier=${shiftKeyMultiplier}
      step=${step}
      value-text=${ifNonEmpty(valueText)}
      value=${value}
      ?disabled=${disabled}
      ?hidden=${hidden}
      ${on('vds-slider-drag-start', onSliderDragStart)}
      ${on('vds-slider-drag-end', onSliderDragEnd)}
      ${on('vds-slider-value-change', onSliderValueChange)}
    ></vds-slider>
  `;
}

export const Slider = Template.bind({});
