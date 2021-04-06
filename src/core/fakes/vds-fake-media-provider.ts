import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { FakeMediaProvider } from './FakeMediaProvider';

export const FAKE_MEDIA_PROVIDER_TAG_NAME = `${LIB_PREFIX}-fake-media-provider` as const;

safelyDefineCustomElement(FAKE_MEDIA_PROVIDER_TAG_NAME, FakeMediaProvider);

declare global {
  interface HTMLElementTagNameMap {
    [FAKE_MEDIA_PROVIDER_TAG_NAME]: FakeMediaProvider;
  }
}
