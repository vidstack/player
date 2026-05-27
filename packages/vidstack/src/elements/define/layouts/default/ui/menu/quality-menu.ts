import { html } from 'lit-html';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultMenuButton } from './items/menu-items';

export function DefaultQualityMenu() {
  return $signal(() => {
    const { hideQualityBitrate, translations } = useDefaultLayoutContext(),
      { canSetQuality, qualities } = useMediaState();

    if (!canSetQuality() || qualities().length <= 1) return null;

    const $autoLabel = $i18n(translations, 'Auto');

    return html`
      <media-menu class="vds-quality-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Quality'),
          icon: 'menu-quality-up',
        })}
        <media-menu-items class="vds-menu-items">
          <media-quality-radio-group
            class="vds-quality-radio-group vds-radio-group"
            auto-label=${$autoLabel}
            ?hide-bitrate=${$signal(hideQualityBitrate)}
          >
            <template>
              <media-radio class="vds-quality-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
                <span class="vds-radio-hint" data-part="bitrate"></span>
              </media-radio>
            </template>
          </media-quality-radio-group>
        </media-menu-items>
      </media-menu>
    `;
  });
}
