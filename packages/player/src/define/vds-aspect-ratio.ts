import { safelyDefineCustomElement } from '@vidstack/foundation';

import { AspectRatioElement } from '../ui/aspect-ratio/AspectRatioElement.js';

safelyDefineCustomElement('vds-aspect-ratio', AspectRatioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-aspect-ratio': AspectRatioElement;
  }
}
