import { safelyDefineCustomElement } from '../../utils/dom';
import { VolumeSliderElement } from './VolumeSliderElement';

safelyDefineCustomElement('vds-volume-slider', VolumeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-volume-slider': VolumeSliderElement;
  }
}
