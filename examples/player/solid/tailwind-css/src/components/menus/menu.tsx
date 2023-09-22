import type { JSX } from 'solid-js';
import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function Menu(props: MenuProps) {
  return (
    <media-menu>
      <Tooltip
        triggerSlot={
          <media-menu-button class="group ring-media-focus relative mr-0.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4">
            {props.buttonSlot}
          </media-menu-button>
        }
        contentSlot={props.tooltipSlot}
        placement={props.tooltipPlacement}
      />

      <media-menu-items
        class="animate-out fade-out slide-out-to-bottom-2 data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden"
        placement={props.placement}
      >
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
