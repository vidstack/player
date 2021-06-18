import {
	MuteButtonElement,
	VDS_MUTE_BUTTON_ELEMENT_TAG_NAME
} from './MuteButtonElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
	}
}
