import { html } from 'lit-html';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import { $signal } from '../../../../lit/directives/signal';

export function DefaultAnnouncer() {
  return $signal(() => {
    const { translations, userPrefersAnnouncements } = useDefaultLayoutContext();

    if (!userPrefersAnnouncements()) return null;

    return html`<media-announcer .translations=${$signal(translations)}></media-announcer>`;
  });
}
