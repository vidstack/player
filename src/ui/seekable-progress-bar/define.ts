import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
} from './SeekableProgressBarElement';

window.customElements.define(
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME]: SeekableProgressBarElement;
  }
}
