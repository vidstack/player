import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
} from './SeekableProgressBarElement.js';

safelyDefineCustomElement(
  SEEKABLE_PROGRESS_BAR_ELEMENT_TAG_NAME,
  SeekableProgressBarElement
);
