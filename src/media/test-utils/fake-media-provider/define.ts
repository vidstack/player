import { safelyDefineCustomElement } from '../../../utils/dom';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
} from './FakeMediaProviderElement';

safelyDefineCustomElement(
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);

declare global {
  interface HTMLElementTagNameMap {
    [FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME]: FakeMediaProviderElement;
  }
}
