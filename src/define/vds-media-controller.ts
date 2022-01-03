import { MediaControllerElement } from '../media/controller/MediaControllerElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-controller', MediaControllerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-controller': MediaControllerElement;
  }
}
