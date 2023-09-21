import type { JSX } from 'solid-js';

import { SubmenuButton } from './submenu-button';

export function Submenu(props: SubmenuProps) {
  return (
    <media-menu class="vds-menu">
      <SubmenuButton label={props.label}>{props.iconSlot}</SubmenuButton>
      <media-menu-items class="vds-menu-items">{props.children}</media-menu-items>
    </media-menu>
  );
}

export interface SubmenuProps {
  label: string;
  iconSlot: JSX.Element;
  children: JSX.Element;
}
