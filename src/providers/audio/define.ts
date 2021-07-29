import { safelyDefineCustomElement } from '../../utils/dom';
import { AUDIO_ELEMENT_TAG_NAME, AudioElement } from './AudioElement';

safelyDefineCustomElement(AUDIO_ELEMENT_TAG_NAME, AudioElement);

declare global {
  interface HTMLElementTagNameMap {
    [AUDIO_ELEMENT_TAG_NAME]: AudioElement;
  }
}
