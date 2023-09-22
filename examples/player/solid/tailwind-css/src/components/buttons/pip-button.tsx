import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PIPButton(props: PIPButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-pip-button class="ring-media-focus group relative mr-0.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden">
          <media-icon class="media-pip:hidden h-8 w-8" type="picture-in-picture" />
          <media-icon class="media-pip:block hidden h-8 w-8" type="picture-in-picture-exit" />
        </media-pip-button>
      }
      contentSlot={
        <>
          <span class="media-pip:hidden">Enter PIP</span>
          <span class="media-pip:block hidden">Exit PIP</span>
        </>
      }
    />
  );
}

export interface PIPButtonProps {
  tooltipPlacement: TooltipPlacement;
}
