import { VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from './constants';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';

declare global {
	interface HTMLElementTagNameMap {
		[VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME]: FakeMediaProviderElement;
	}
}
