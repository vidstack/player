import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
} from './FakeMediaProviderElement.js';
safelyDefineCustomElement(
  FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);
