import { safelyDefineCustomElement } from '../../../utils/dom';
import { FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './fullscreen-button.types';
import { FullscreenButtonElement } from './FullscreenButtonElement';

export const VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = 'vds-fullscreen-button';

safelyDefineCustomElement(
	VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
	FullscreenButtonElement
);

declare global {
	interface HTMLElementTagNameMap {
		[VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME]: FullscreenButtonElement;
	}
}
