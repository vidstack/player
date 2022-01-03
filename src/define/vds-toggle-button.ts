import { ToggleButtonElement } from '../ui/toggle-button/ToggleButtonElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-toggle-button', ToggleButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-toggle-button': ToggleButtonElement;
  }
}
