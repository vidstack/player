import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  SCRUBBER_ELEMENT_TAG_NAME,
  ScrubberElement
} from './ScrubberElement.js';

safelyDefineCustomElement(SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);
