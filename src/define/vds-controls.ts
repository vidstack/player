import { ControlsElement } from '../ui/controls/ControlsElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-controls', ControlsElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-controls': ControlsElement;
  }
}
