import { html } from 'lit-html';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultMenuButton } from './items/menu-items';

export function DefaultCaptionsMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext(),
      { hasCaptions } = useMediaState(),
      $offText = $i18n(translations, 'Off');

    if (!hasCaptions()) return null;

    return html`
      <media-menu class="vds-captions-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Captions'),
          icon: 'menu-captions',
        })}
        <media-menu-items class="vds-menu-items">
          <media-captions-radio-group
            class="vds-captions-radio-group vds-radio-group"
            off-label=${$offText}
          >
            <template>
              <media-radio class="vds-caption-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
              </media-radio>
            </template>
          </media-captions-radio-group>
        </media-menu-items>
      </media-menu>
    `;
  });
}
