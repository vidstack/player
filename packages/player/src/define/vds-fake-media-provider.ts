import { safelyDefineCustomElement } from '@vidstack/foundation';

import { FakeMediaProviderElement } from '../media/test-utils/FakeMediaProviderElement';

safelyDefineCustomElement('vds-fake-media-provider', FakeMediaProviderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-media-provider': FakeMediaProviderElement;
  }
}
