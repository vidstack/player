import { safelyDefineCustomElement } from '../../../utils/dom';
import { TOGGLE_BUTTON_ELEMENT_TAG_NAME } from './toggle-button.types';
import { ToggleButtonElement } from './ToggleButtonElement';

export const VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME = 'vds-toggle-button';

safelyDefineCustomElement(
	VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
	ToggleButtonElement
);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME]: ToggleButtonElement;
	}
}
