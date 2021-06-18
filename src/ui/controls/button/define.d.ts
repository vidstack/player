import { ButtonElement, VDS_BUTTON_ELEMENT_TAG_NAME } from './ButtonElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_BUTTON_ELEMENT_TAG_NAME]: ButtonElement;
	}
}
