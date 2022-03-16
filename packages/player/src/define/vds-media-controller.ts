import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaControllerElement } from '../media/controller/MediaControllerElement';

safelyDefineCustomElement('vds-media-controller', MediaControllerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-controller': MediaControllerElement;
  }
}
