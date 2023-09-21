import { CaptionSubmenu } from './caption-submenu';
import { Menu } from './menu';

export function SettingsMenu() {
  return (
    <Menu
      placement="top end"
      buttonSlot={<media-icon class="vds-rotate-icon" type="settings" />}
      tooltipPlacement="top end"
      tooltipSlot={<span>Settings</span>}
    >
      <CaptionSubmenu />
    </Menu>
  );
}
