import { defineCustomElement } from 'maverick.js/element';
import { isString } from 'maverick.js/std';

import { aspectRatioProps } from './props';
import type { AspectRatioElement } from './types';

export const AspectRatioDefinition = defineCustomElement<AspectRatioElement>({
  tagName: 'vds-aspect-ratio',
  props: aspectRatioProps,
  setup({ host, props: { $minHeight, $maxHeight, $ratio } }) {
    host.setStyles({
      '--vds-aspect-ratio-percent': calcPercent,
      '--vds-aspect-ratio-min-height': $minHeight,
      '--vds-aspect-ratio-max-height': $maxHeight,
    });

    function calcPercent() {
      const ratio = $ratio();
      const isValid = isString(ratio) ? /\d{1,2}\s*?(?:\/|:)\s*?\d{1,2}/.test(ratio) : false;

      if (isValid) {
        const [width, height] = ratio.split(/\s*?(?:\/|:)\s*?/).map(Number);
        return `${(height / width) * 100}%`;
      }

      return '50%';
    }
  },
});

export default AspectRatioDefinition;
