import { safelyDefineCustomElement } from '../../../utils/dom';
import { SLIDER_ELEMENT_TAG_NAME } from './slider.types';
import { SliderElement } from './SliderElement';

export const VDS_SLIDER_ELEMENT_TAG_NAME = 'vds-slider';

safelyDefineCustomElement(VDS_SLIDER_ELEMENT_TAG_NAME, SliderElement);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_SLIDER_ELEMENT_TAG_NAME]: SliderElement;
	}
}
