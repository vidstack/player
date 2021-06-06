import { safelyDefineCustomElement } from '../../utils/dom';
import { VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME } from './constants';
import { MediaContainerElement } from './MediaContainerElement';

safelyDefineCustomElement(
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME,
	MediaContainerElement
);
