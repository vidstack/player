import { safelyDefineCustomElement } from '../../utils/dom';
import { AspectRatioElement } from './AspectRatioElement';

safelyDefineCustomElement('vds-aspect-ratio', AspectRatioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-aspect-ratio': AspectRatioElement;
  }
}
