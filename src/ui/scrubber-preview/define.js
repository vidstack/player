import { safelyDefineCustomElement } from '@utils/dom.js';
import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from './ScrubberPreviewElement.js';

safelyDefineCustomElement(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);
