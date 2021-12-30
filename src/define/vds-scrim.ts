import { ScrimElement } from '../ui/scrim/ScrimElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-scrim', ScrimElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrim': ScrimElement;
  }
}
