import { safelyDefineCustomElement } from '../../utils/dom';
import { SCRIM_ELEMENT_TAG_NAME, ScrimElement } from './ScrimElement';

safelyDefineCustomElement(SCRIM_ELEMENT_TAG_NAME, ScrimElement);

declare global {
  interface HTMLElementTagNameMap {
    [SCRIM_ELEMENT_TAG_NAME]: ScrimElement;
  }
}
