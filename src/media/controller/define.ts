import { safelyDefineCustomElement } from '../../utils/dom';
import { MediaControllerElement } from './MediaControllerElement';

safelyDefineCustomElement('vds-media-controller', MediaControllerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-controller': MediaControllerElement;
  }
}
