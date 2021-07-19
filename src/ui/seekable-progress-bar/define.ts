import { safelyDefineCustomElement } from '../../utils/dom';
import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
} from './SeekableProgressBarElement';

safelyDefineCustomElement(
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME]: SeekableProgressBarElement;
  }
}
