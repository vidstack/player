import styles from './caption-submenu.module.css';

import { MenuRadio } from './menu-radio';
import { Submenu } from './submenu';

export function CaptionSubmenu() {
  return (
    <Submenu label="Captions" iconSlot={<media-icon class={styles.icon} type="closed-captions" />}>
      <media-captions-radio-group class={styles.radioGroup}>
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </Submenu>
  );
}
