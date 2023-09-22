import buttonStyles from '../buttons/button.module.css';
import styles from './menu.module.css';

import type { JSX } from 'solid-js';
import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function Menu(props: MenuProps) {
  return (
    <media-menu>
      <Tooltip
        triggerSlot={
          <media-menu-button class={buttonStyles.button}>{props.buttonSlot}</media-menu-button>
        }
        contentSlot={props.tooltipSlot}
        placement={props.tooltipPlacement}
      />

      <media-menu-items class={styles.content} placement={props.placement}>
        {props.children}
      </media-menu-items>
    </media-menu>
  );
}

export interface MenuProps {
  placement: MenuPlacement;
  buttonSlot: JSX.Element;
  tooltipSlot: JSX.Element;
  children: JSX.Element;
  tooltipPlacement: TooltipPlacement;
}
