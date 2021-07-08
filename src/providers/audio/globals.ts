import { AUDIO_ELEMENT_TAG_NAME, AudioElement } from './AudioElement';

declare global {
  interface HTMLElementTagNameMap {
    [AUDIO_ELEMENT_TAG_NAME]: AudioElement;
  }
}
