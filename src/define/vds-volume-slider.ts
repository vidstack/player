import { VolumeSliderElement } from '../ui/volume-slider/VolumeSliderElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-volume-slider', VolumeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-volume-slider': VolumeSliderElement;
  }
}
