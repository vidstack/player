import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
} from './SeekableProgressBarElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME]: SeekableProgressBarElement;
  }
}
