import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MuteButtonElement } from '../ui/mute-button/MuteButtonElement';

safelyDefineCustomElement('vds-mute-button', MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}
