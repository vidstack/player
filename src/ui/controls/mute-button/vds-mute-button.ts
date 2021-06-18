import { safelyDefineCustomElement } from '../../../utils/dom';
import { MUTE_BUTTON_ELEMENT_TAG_NAME } from './mute-button.types';
import { MuteButtonElement } from './MuteButtonElement';

export const VDS_MUTE_BUTTON_ELEMENT_TAG_NAME = 'vds-mute-button';

safelyDefineCustomElement(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
	}
}
