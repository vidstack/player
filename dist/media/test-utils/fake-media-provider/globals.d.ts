import { FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME, FakeMediaProviderElement } from './FakeMediaProviderElement.js';
declare global {
    interface HTMLElementTagNameMap {
        [FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME]: FakeMediaProviderElement;
    }
}
