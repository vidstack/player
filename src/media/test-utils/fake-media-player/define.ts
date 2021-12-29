import { safelyDefineCustomElement } from '../../../utils/dom';
import { FakeMediaPlayerElement } from './FakeMediaPlayerElement';

safelyDefineCustomElement('vds-fake-media-player', FakeMediaPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fake-media-player': FakeMediaPlayerElement;
  }
}
