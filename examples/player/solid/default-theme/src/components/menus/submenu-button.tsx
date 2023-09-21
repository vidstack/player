import type { JSX } from 'solid-js';

export function SubmenuButton(props: SubmenuButtonProps) {
  return (
    <media-menu-button class="vds-menu-button">
      <media-icon class="vds-menu-button-close-icon" type="chevron-left" />
      {props.children}
      <span class="vds-menu-button-label">{props.label}</span>
      <span class="vds-menu-button-hint" data-part="hint"></span>
      <media-icon class="vds-menu-button-open-icon" type="chevron-right" />
    </media-menu-button>
  );
}

export interface SubmenuButtonProps {
  label: string;
  children: JSX.Element;
}
