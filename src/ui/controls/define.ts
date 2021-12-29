import { safelyDefineCustomElement } from '../../utils/dom';
import { ControlsElement } from './ControlsElement';

safelyDefineCustomElement('vds-controls', ControlsElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-controls': ControlsElement;
  }
}
