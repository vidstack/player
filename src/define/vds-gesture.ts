import { GestureElement } from '../ui/gesture/GestureElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-gesture', GestureElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-gesture': GestureElement;
  }
}
