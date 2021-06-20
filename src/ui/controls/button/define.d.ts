import { ButtonElement, VDS_BUTTON_ELEMENT_TAG_NAME } from './ButtonElement.js';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_BUTTON_ELEMENT_TAG_NAME]: ButtonElement;
	}
}
