import styles from './submenu-button.module.css';

import type { JSX } from 'solid-js';

export function SubmenuButton(props: SubmenuButtonProps) {
  return (
    <media-menu-button class={styles.button}>
      <media-icon class={styles.closeIcon} type="chevron-left" />
      <div class={styles.icon}>{props.children}</div>
      <span class={styles.label}>{props.label}</span>
      <span class={styles.hintText} data-part="hint"></span>
      <media-icon class={styles.openIcon} type="chevron-right" />
    </media-menu-button>
  );
}

export interface SubmenuButtonProps {
  label: string;
  children: JSX.Element;
}
