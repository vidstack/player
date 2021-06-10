import { safelyDefineCustomElement } from '../../../utils/dom';
import { VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from './constants';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';

safelyDefineCustomElement(
	VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
	FakeMediaProviderElement
);
