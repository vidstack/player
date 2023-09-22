import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PlayButton(props: PlayButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-play-button class="ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4">
          <media-icon class="media-paused:block hidden h-8 w-8" type="play" />
          <media-icon class="media-paused:hidden h-8 w-8" type="pause" />
        </media-play-button>
      }
      contentSlot={
        <>
          <span class="media-paused:block hidden">Play</span>
          <span class="media-paused:hidden">Pause</span>
        </>
      }
    />
  );
}

export interface PlayButtonProps {
  tooltipPlacement: TooltipPlacement;
}
