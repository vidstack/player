import { safelyDefineCustomElement } from '../../utils/dom';
import { ToggleButtonElement } from './ToggleButtonElement';

safelyDefineCustomElement('vds-toggle-button', ToggleButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-toggle-button': ToggleButtonElement;
  }
}
