import { safelyDefineCustomElement } from '../../../utils/dom';
import { PLAY_BUTTON_ELEMENT_TAG_NAME } from './play-button.types';
import { PlayButtonElement } from './PlayButtonElement';

export const VDS_PLAY_BUTTON_ELEMENT_TAG_NAME = 'vds-play-button';

safelyDefineCustomElement(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME, PlayButtonElement);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_PLAY_BUTTON_ELEMENT_TAG_NAME]: PlayButtonElement;
	}
}
