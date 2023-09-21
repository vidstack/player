import type { JSX } from 'solid-js';
import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function Menu(props: MenuProps) {
  return (
    <media-menu class="vds-menu">
      <Tooltip
        triggerSlot={
          <media-menu-button class="vds-menu-button vds-button">
            {props.buttonSlot}
          </media-menu-button>
        }
        contentSlot={props.tooltipSlot}
        placement={props.tooltipPlacement}
      />

      <media-menu-items class="vds-menu-items" placement={props.placement}>
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
