import { FakeMediaProviderElement } from '../media/test-utils/fake-media-provider/FakeMediaProviderElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-fake-media-provider', FakeMediaProviderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-media-provider': FakeMediaProviderElement;
  }
}
