import { MenuRadio } from './menu-radio';
import { Submenu } from './submenu';

export function CaptionSubmenu() {
  return (
    <Submenu
      label="Captions"
      iconSlot={<media-icon class="vds-menu-button-icon" type="closed-captions" />}
    >
      <media-captions-radio-group class="vds-captions-radio-group vds-radio-group">
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </Submenu>
  );
}
