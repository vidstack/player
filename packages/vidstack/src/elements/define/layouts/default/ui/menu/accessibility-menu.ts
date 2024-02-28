import { html } from 'lit-html';
import { computed } from 'maverick.js';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import { i18n } from '../../../../../../components/layouts/default/translations';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { $i18n } from '../utils';
import { DefaultFontMenu } from './font-menu';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton, DefaultMenuItem, DefaultMenuSection } from './items/menu-items';

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
            DefaultMenuSection({
              children: [
                DefaultAnnouncementsMenuCheckbox(),
                DefaultKeyboardAnimationsMenuCheckbox(),
              ],
            }),
            DefaultMenuSection({
              children: [DefaultFontMenu()],
            }),
          ]}
        </media-menu-items>
      </media-menu>
    `;
  });
}

function DefaultAnnouncementsMenuCheckbox() {
  const { userPrefersAnnouncements, translations } = useDefaultLayoutContext(),
    label = 'Announcements';

  return DefaultMenuItem({
    label: $i18n(translations, label),
    children: DefaultMenuCheckbox({
      label,
      storageKey: 'vds-player::announcements',
      onChange(checked) {
        userPrefersAnnouncements.set(checked);
      },
    }),
  });
}

function DefaultKeyboardAnimationsMenuCheckbox() {
  return $signal(() => {
    const { translations, userPrefersKeyboardAnimations, noKeyboardAnimations } =
        useDefaultLayoutContext(),
      { viewType } = useMediaState(),
      $disabled = computed(() => viewType() !== 'video' || noKeyboardAnimations());

    if ($disabled()) return null;

    const label = 'Keyboard Animations';

    return DefaultMenuItem({
      label: $i18n(translations, label),
      children: DefaultMenuCheckbox({
        label,
        defaultChecked: true,
        storageKey: 'vds-player::keyboard-animations',
        onChange(checked) {
          userPrefersKeyboardAnimations.set(checked);
        },
      }),
    });
  });
}
