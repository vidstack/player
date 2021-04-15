import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { FakeMediaProviderElement } from './FakeMediaProviderElement';
import { FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME } from './fakes.types';

export const VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME,
  FakeMediaProviderElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_FAKE_MEDIA_PROVIDER_ELEMENT_TAG_NAME]: FakeMediaProviderElement;
  }
}
