import { safelyDefineCustomElement } from '../../utils/dom';
import {
	MediaContainerElement,
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME
} from './MediaContainerElement';

safelyDefineCustomElement(
	VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME,
	MediaContainerElement
);
