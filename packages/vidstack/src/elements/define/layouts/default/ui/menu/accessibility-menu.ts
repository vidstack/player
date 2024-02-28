import { html } from 'lit-html';
import { computed } from 'maverick.js';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultFontMenu } from './font-menu';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton } from './items/menu-items';

export function DefaultAccessibilityMenu() {
  return $signal(() => {
    const { translations } = useDefaultLayoutContext();
    return html`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${DefaultMenuButton({
          label: () => i18n(translations, 'Accessibility'),
          icon: 'menu-accessibility',
        })}
        <media-menu-items class="vds-menu-items">
          ${[
            DefaultMenuAnnouncementsCheckbox(),
            DefaultMenuKeyboardAnimationCheckbox(),
            DefaultFontMenu(),
          ]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultMenuAnnouncementsCheckbox() {
  const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(),
    label = 'Announcements',
    $label = $i18n(translations, label);
  return html`
    <div class="vds-menu-item vds-menu-item-checkbox">
      <div class="vds-menu-item-label">${$label}</div>
      ${DefaultMenuCheckbox({
        label,
        storageKey: 'vds-player::announcements',
        onChange(checked) {
          userPrefersAnnouncements.set(checked);
        },
      })}
    </div>
  `;
}

function DefaultMenuKeyboardAnimationCheckbox() {
  return $signal(() => {
    const { translations, userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
      { viewType } = useMediaState(),
      $disabled = computed(() => viewType() !== 'video');

    if ($disabled()) return null;

    const label = 'Keyboard Animations',
      $label = $i18n(translations, label);

    return html`
      <div class="vds-menu-item">
        <div class="vds-menu-item-label">${$label}</div>
        ${DefaultMenuCheckbox({
          label,
          defaultChecked: true,
          storageKey: 'vds-player::keyboard-animations',
          onChange(checked) {
            userPrefersKeyboardAnimations.set(checked);
          },
        })}
      </div>
    `;
  });
}
