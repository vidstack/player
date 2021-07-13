import { SCRIM_ELEMENT_TAG_NAME, ScrimElement } from './ScrimElement';

declare global {
  interface HTMLElementTagNameMap {
    [SCRIM_ELEMENT_TAG_NAME]: ScrimElement;
  }
}
