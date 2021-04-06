import { html, TemplateResult } from 'lit-html';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
  buildStorybookControlsFromManifest,
  VdsEventsToStorybookActions,
} from '../../../shared/storybook';
import { VdsSliderEvents } from './slider.events';
import { SliderProps } from './slider.types';
import { SLIDER_TAG_NAME } from './vds-slider';

export default {
  title: 'UI/Foundation/Controls/Slider',
  component: SLIDER_TAG_NAME,
  argTypes: buildStorybookControlsFromManifest(SLIDER_TAG_NAME),
};

type Args = SliderProps & VdsEventsToStorybookActions<VdsSliderEvents>;

function Template({
  // Props
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
  // Events
  onVdsSliderDragStart,
  onVdsSliderDragEnd,
  onVdsSliderValueChange,
}: Args): TemplateResult {
  return html`
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
      @vds-slider-value-change="${onVdsSliderValueChange}"
      @vds-slider-drag-start="${onVdsSliderDragStart}"
      @vds-slider-drag-end="${onVdsSliderDragEnd}"
    ></vds-slider>
  `;
}

export const Slider = Template.bind({});
