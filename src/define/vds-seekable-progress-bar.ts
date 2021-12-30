import { SeekableProgressBarElement } from '../ui/seekable-progress-bar/SeekableProgressBarElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement(
  'vds-seekable-progress-bar',
  SeekableProgressBarElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-seekable-progress-bar': SeekableProgressBarElement;
  }
}
