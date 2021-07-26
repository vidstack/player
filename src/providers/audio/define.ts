import { AUDIO_ELEMENT_TAG_NAME, AudioElement } from './AudioElement';

window.customElements.define(AUDIO_ELEMENT_TAG_NAME, AudioElement);

declare global {
  interface HTMLElementTagNameMap {
    [AUDIO_ELEMENT_TAG_NAME]: AudioElement;
  }
}
