import { MenuRadio } from './menu-radio';
import { Submenu } from './submenu';

export function CaptionSubmenu() {
  return (
    <Submenu label="Captions" iconSlot={<media-icon class="h-5 w-5" type="closed-captions" />}>
      <media-captions-radio-group class="w-full flex flex-col">
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </Submenu>
  );
}
