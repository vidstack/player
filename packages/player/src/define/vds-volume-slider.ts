import { safelyDefineCustomElement } from '@vidstack/foundation';

import { VolumeSliderElement } from '../ui/volume-slider/VolumeSliderElement.js';

safelyDefineCustomElement('vds-volume-slider', VolumeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-volume-slider': VolumeSliderElement;
  }
}
