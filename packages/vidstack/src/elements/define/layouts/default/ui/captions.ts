import { html } from 'lit-html';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import { $i18n } from './utils';

export function DefaultCaptions() {
  const { translations } = useDefaultLayoutContext();
  return html`
    <media-captions
      class="vds-captions"
      .exampleText=${$i18n(translations, 'Captions look like this')}
    ></media-captions>
  `;
}
