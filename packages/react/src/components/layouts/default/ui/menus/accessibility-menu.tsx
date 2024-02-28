import * as React from 'react';

import { useMediaState } from '../../../../../hooks/use-media-state';
import * as Menu from '../../../../ui/menu';
import { useDefaultLayoutContext, useDefaultLayoutWord } from '../../context';
import { DefaultFontMenu } from './font-menu';
import { DefaultMenuCheckbox } from './items/menu-checkbox';
import { DefaultMenuButton } from './items/menu-items';

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
        <DefaultMenuAnnouncementsCheckbox />
        <DefaultMenuKeyboardAnimationCheckbox />
        <DefaultFontMenu />
      </Menu.Content>
    </Menu.Root>
  );
}

DefaultAccessibilityMenu.displayName = 'DefaultAccessibilityMenu';
export { DefaultAccessibilityMenu };

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuAnnouncementsCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuAnnouncementsCheckbox() {
  const label = 'Announcements',
    { userPrefersAnnouncements } = useDefaultLayoutContext(),
    translatedLabel = useDefaultLayoutWord(label);

  function onChange(checked: boolean) {
    userPrefersAnnouncements.set(checked);
  }

  return (
    <div className="vds-menu-item">
      <div className="vds-menu-item-label">{translatedLabel}</div>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::announcements"
        onChange={onChange}
      />
    </div>
  );
}

DefaultMenuAnnouncementsCheckbox.displayName = 'DefaultMenuAnnouncementsCheckbox';

/* -------------------------------------------------------------------------------------------------
 * DefaultMenuKeyboardAnimationCheckbox
 * -----------------------------------------------------------------------------------------------*/

function DefaultMenuKeyboardAnimationCheckbox() {
  const label = 'Keyboard Animations',
    $viewType = useMediaState('viewType'),
    { userPrefersKeyboardAnimations } = useDefaultLayoutContext(),
    translatedLabel = useDefaultLayoutWord(label);

  if ($viewType !== 'video') return null;

  function onChange(checked: boolean) {
    userPrefersKeyboardAnimations.set(checked);
  }

  return (
    <div className="vds-menu-item">
      <div className="vds-menu-item-label">{translatedLabel}</div>
      <DefaultMenuCheckbox
        label={label}
        defaultChecked
        storageKey="vds-player::keyboard-animations"
        onChange={onChange}
      />
    </div>
  );
}

DefaultMenuKeyboardAnimationCheckbox.displayName = 'DefaultMenuKeyboardAnimationCheckbox';
