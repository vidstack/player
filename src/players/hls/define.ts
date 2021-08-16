import { safelyDefineCustomElement } from '../../utils/dom';
import {
  HLS_PLAYER_ELEMENT_TAG_NAME,
  HlsPlayerElement
} from './HlsPlayerElement';

safelyDefineCustomElement(HLS_PLAYER_ELEMENT_TAG_NAME, HlsPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    [HLS_PLAYER_ELEMENT_TAG_NAME]: HlsPlayerElement;
  }
}
