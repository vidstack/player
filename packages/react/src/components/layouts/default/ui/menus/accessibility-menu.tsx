import * as React from 'react';

import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultFontMenu } from './font-menu';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton, DefaultMenuItem, DefaultMenuSection } from './items/menu-items';

/* -------------------------------------------------------------------------------------------------
 * DefaultAccessibilityMenu
 * -----------------------------------------------------------------------------------------------*/

function DefaultAccessibilityMenu() {
  const label = useDefaultLayoutWord('Accessibility'),
    { icons: Icons } = useDefaultLayoutContext();

  return (
    <Menu.Root className="vds-accessibility-menu vds-menu">
      <DefaultMenuButton label={label} Icon={Icons.Menu.Accessibility} />
      <Menu.Content className="vds-menu-items">
        <DefaultMenuSection>
          <DefaultAnnouncementsMenuCheckbox />
          <DefaultKeyboardAnimationsMenuCheckbox />
        </DefaultMenuSection>

        <DefaultMenuSection>
          <DefaultFontMenu />
        </DefaultMenuSection>
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAccessibilityMenu.displayName = 'DefaultAccessibilityMenu';
export { DefaultAccessibilityMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultAnnouncementsMenuCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultAnnouncementsMenuCheckbox() {
  const { userPrefersAnnouncements } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Announcements');

  function onChange(checked: boolean) {
    userPrefersAnnouncements.set(checked);
  }

  return (
    <DefaultMenuItem label={label}>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::announcements"
        onChange={onChange}
      />
    </DefaultMenuItem>
  );
}

DefaultAnnouncementsMenuCheckbox.displayName = 'DefaultAnnouncementsMenuCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultKeyboardAnimationsMenuCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultKeyboardAnimationsMenuCheckbox() {
  const $viewType = useMediaState('viewType'),
    { userPrefersKeyboardAnimations, noKeyboardAnimations } = useDefaultLayoutContext(),
    label = useDefaultLayoutWord('Keyboard Animations');

  if ($viewType !== 'video' || noKeyboardAnimations) return null;

  function onChange(checked: boolean) {
    userPrefersKeyboardAnimations.set(checked);
  }

  return (
    <DefaultMenuItem label={label}>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::keyboard-animations"
        onChange={onChange}
      />
    </DefaultMenuItem>
  );
}

DefaultKeyboardAnimationsMenuCheckbox.displayName = 'DefaultKeyboardAnimationsMenuCheckbox';
