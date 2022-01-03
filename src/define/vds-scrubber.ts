import { ScrubberElement } from '../ui/scrubber/ScrubberElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-scrubber', ScrubberElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber': ScrubberElement;
  }
}
