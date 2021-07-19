import { safelyDefineCustomElement } from '../../utils/dom';
import {
  MUTE_BUTTON_ELEMENT_TAG_NAME,
  MuteButtonElement
} from './MuteButtonElement';

safelyDefineCustomElement(MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
  }
}
