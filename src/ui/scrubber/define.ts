import { safelyDefineCustomElement } from '../../utils/dom';
import { ScrubberElement } from './ScrubberElement';

safelyDefineCustomElement('vds-scrubber', ScrubberElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber': ScrubberElement;
  }
}
