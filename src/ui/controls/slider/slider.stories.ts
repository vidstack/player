import './vds-slider';

import { action } from '@storybook/addon-actions';
import { html } from 'lit-element';

import { Story } from '../../../shared/storybook';
import { SLIDER_ARG_TYPES, SliderArgTypes } from './slider.args';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent,
} from './slider.events';

export default {
  title: 'Foundational UI/Slider',
  component: 'vds-slider',
  argTypes: SLIDER_ARG_TYPES,
};

const Template: Story<SliderArgTypes> = ({
  min = 0,
  max,
  value,
  onValueChange = action(SliderValueChangeEvent.TYPE),
  onDragStart = action(SliderDragStartEvent.TYPE),
  onDragEnd = action(SliderDragEndEvent.TYPE),
}) =>
  html`
    <vds-slider
      min="${min}"
      max="${max}"
      value="${value}"
      @vds-slider-value-change="${onValueChange}"
      @vds-slider-drag-start="${onDragStart}"
      @vds-slider-drag-end="${onDragEnd}"
    ></vds-slider>
  `;

export const Slider = Template.bind({});
