import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaUiElement } from '../media/ui/MediaUiElement';

safelyDefineCustomElement('vds-media-ui', MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-ui': MediaUiElement;
  }
}

if (__DEV__) {
  // TODO: add release notes link.
  console.warn('`<vds-media-ui>` has been deprecated and will be removed in 1.0.');
}
