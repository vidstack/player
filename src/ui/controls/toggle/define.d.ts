import { ToggleElement, VDS_TOGGLE_ELEMENT_TAG_NAME } from './ToggleElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_TOGGLE_ELEMENT_TAG_NAME]: ToggleElement;
	}
}
