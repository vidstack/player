import { safelyDefineCustomElement } from '../../../utils/dom';
import {
	FakeMediaProviderElement,
	VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
} from './FakeMediaProviderElement';

safelyDefineCustomElement(
	VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
	FakeMediaProviderElement
);
