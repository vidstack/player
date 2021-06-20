import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
	MediaContainerElement,
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME
} from './MediaContainerElement.js';

safelyDefineCustomElement(
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME,
	MediaContainerElement
);
