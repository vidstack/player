import './vds-media-ui';

import { FakeMediaPlayerElement } from '../media/test-utils/fake-media-player/FakeMediaPlayerElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-media-player': FakeMediaPlayerElement;
  }
}
