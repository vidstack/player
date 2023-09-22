import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function MuteButton(props: MuteButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-mute-button class="ring-media-focus group relative -mr-1.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4">
          <media-icon class="hidden h-8 w-8 group-data-[state='muted']:block" type="mute" />
          <media-icon class="hidden h-8 w-8 group-data-[state='low']:block" type="volume-low" />
          <media-icon class="hidden h-8 w-8 group-data-[state='high']:block" type="volume-high" />
        </media-mute-button>
      }
      contentSlot={
        <>
          <span class="media-muted:hidden">Mute</span>
          <span class="media-muted:block hidden">Unmute</span>
        </>
      }
    />
  );
}

export interface MuteButtonProps {
  tooltipPlacement: TooltipPlacement;
}
