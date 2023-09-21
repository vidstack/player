import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PlayButton(props: PlayButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-play-button class="vds-button">
          <media-icon class="vds-play-icon" type="play" />
          <media-icon class="vds-pause-icon" type="pause" />
        </media-play-button>
      }
      contentSlot={
        <>
          <span class="vds-play-tooltip-text">Play</span>
          <span class="vds-pause-tooltip-text">Pause</span>
        </>
      }
    />
  );
}

export interface PlayButtonProps {
  tooltipPlacement: TooltipPlacement;
}
