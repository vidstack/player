import { AspectRatioElement } from '../ui/aspect-ratio/AspectRatioElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-aspect-ratio', AspectRatioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-aspect-ratio': AspectRatioElement;
  }
}
