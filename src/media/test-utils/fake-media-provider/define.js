import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  FakeMediaProviderElement,
  VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME
} from './FakeMediaProviderElement.js';

safelyDefineCustomElement(
  VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement
);
