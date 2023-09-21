import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function MuteButton(props: MuteButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-mute-button class="vds-button">
          <media-icon class="vds-mute-icon" type="mute" />
          <media-icon class="vds-volume-low-icon" type="volume-low" />
          <media-icon class="vds-volume-high-icon" type="volume-high" />
        </media-mute-button>
      }
      contentSlot={
        <>
          <span class="vds-mute-tooltip-text">Unmute</span>
          <span class="vds-unmute-tooltip-text">Mute</span>
        </>
      }
    />
  );
}

export interface MuteButtonProps {
  tooltipPlacement: TooltipPlacement;
}
