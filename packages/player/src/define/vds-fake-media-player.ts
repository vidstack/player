import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { FakeMediaPlayerElement } from '../media/test-utils/FakeMediaPlayerElement.js';

safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-media-player': FakeMediaPlayerElement;
  }
}
