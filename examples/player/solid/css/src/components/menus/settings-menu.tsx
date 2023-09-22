import styles from './settings-menu.module.css';

import { CaptionSubmenu } from './caption-submenu';
import { Menu } from './menu';

export function SettingsMenu() {
  return (
    <Menu
      placement="top end"
      buttonSlot={<media-icon class={styles.rotateIcon} type="settings" />}
      tooltipPlacement="top end"
      tooltipSlot={<span>Settings</span>}
    >
      <CaptionSubmenu />
    </Menu>
  );
}
