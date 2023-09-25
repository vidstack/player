import styles from './settings-menu.module.css';

import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import { CaptionSubmenu } from './caption-submenu';
import { Menu } from './menu';

export function SettingsMenu(props: SettingsMenuProps) {
  return (
    <Menu
      placement={props.placement}
      buttonSlot={<media-icon class={styles.rotateIcon} type="settings" />}
      tooltipPlacement={props.tooltipPlacement}
      tooltipSlot={<span>Settings</span>}
    >
      <CaptionSubmenu />
    </Menu>
  );
}

export interface SettingsMenuProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}
