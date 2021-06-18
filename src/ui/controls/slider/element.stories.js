import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { VDS_SLIDER_ELEMENT_TAG_NAME } from './SliderElement';

export default {
	title: 'UI/Foundation/Controls/Slider',
	component: VDS_SLIDER_ELEMENT_TAG_NAME,
	argTypes: {}
};

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
	onVdsSliderValueChange
}) {
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
