import { MediaSyncElement } from '../media/manage/MediaSyncElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-sync', MediaSyncElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-sync': MediaSyncElement;
  }
}
