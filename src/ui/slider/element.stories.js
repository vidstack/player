import './define.js';

import { html } from 'lit';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent
} from './events.js';
import { SLIDER_ELEMENT_TAG_NAME } from './SliderElement.js';

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
  onSliderDragStart: storybookAction(SliderDragStartEvent.TYPE),
  onSliderDragEnd: storybookAction(SliderDragEndEvent.TYPE),
  onSliderValueChange: storybookAction(SliderValueChangeEvent.TYPE)
};

export default {
  title: 'UI/Controls/Slider',
  component: SLIDER_ELEMENT_TAG_NAME,
  argTypes: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
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
  // Actions
  onSliderDragStart,
  onSliderDragEnd,
  onSliderValueChange
}) {
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
      ${on(SliderDragStartEvent.TYPE, onSliderDragStart)}
      ${on(SliderDragEndEvent.TYPE, onSliderDragEnd)}
      ${on(SliderValueChangeEvent.TYPE, onSliderValueChange)}
    ></vds-slider>
  `;
}

export const Slider = Template.bind({});
