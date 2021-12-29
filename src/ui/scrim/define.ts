import { safelyDefineCustomElement } from '../../utils/dom';
import { ScrimElement } from './ScrimElement';

safelyDefineCustomElement('vds-scrim', ScrimElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrim': ScrimElement;
  }
}
