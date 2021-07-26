import {
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
} from './VolumeSliderElement';

window.customElements.define(
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
);

declare global {
  interface HTMLElementTagNameMap {
    [VOLUME_SLIDER_ELEMENT_TAG_NAME]: VolumeSliderElement;
  }
}
