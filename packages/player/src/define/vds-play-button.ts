import { safelyDefineCustomElement } from '@vidstack/foundation';

import { PlayButtonElement } from '../ui/play-button/PlayButtonElement';

safelyDefineCustomElement('vds-play-button', PlayButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-play-button': PlayButtonElement;
  }
}
