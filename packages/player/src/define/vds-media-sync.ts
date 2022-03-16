import { safelyDefineCustomElement } from '@vidstack/foundation';

import { MediaSyncElement } from '../media/manage/MediaSyncElement';

safelyDefineCustomElement('vds-media-sync', MediaSyncElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-sync': MediaSyncElement;
  }
}
