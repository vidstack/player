import { CaptionSubmenu } from './caption-submenu';
import { Menu } from './menu';

export function SettingsMenu() {
  return (
    <Menu
      placement="top end"
      buttonSlot={
        <media-icon
          class="h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90"
          type="settings"
        />
      }
      tooltipPlacement="top end"
      tooltipSlot={<span>Settings</span>}
    >
      <CaptionSubmenu />
    </Menu>
  );
}
