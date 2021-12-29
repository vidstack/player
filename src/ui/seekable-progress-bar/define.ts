import { safelyDefineCustomElement } from '../../utils/dom';
import { SeekableProgressBarElement } from './SeekableProgressBarElement';

safelyDefineCustomElement(
  'vds-seekable-progress-bar',
  SeekableProgressBarElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-seekable-progress-bar': SeekableProgressBarElement;
  }
}
