import { VDS_MEDIA_UI_ELEMENT_TAG_NAME } from './media-ui.constants';
import { MediaUiElement } from './MediaUiElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
	}
}
