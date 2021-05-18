import { safelyDefineCustomElement } from '../../../utils/dom';
import { VDS_MEDIA_UI_ELEMENT_TAG_NAME } from './media-ui.constants';
import { MediaUiElement } from './MediaUiElement';

safelyDefineCustomElement(VDS_MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);
