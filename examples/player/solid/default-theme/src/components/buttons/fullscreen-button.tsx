import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function FullscreenButton(props: FullscreenButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-fullscreen-button class="vds-button">
          <media-icon class="vds-fs-enter-icon" type="fullscreen" />
          <media-icon class="vds-fs-exit-icon" type="fullscreen-exit" />
        </media-fullscreen-button>
      }
      contentSlot={
        <>
          <span class="vds-fs-enter-tooltip-text">Enter Fullscreen</span>
          <span class="vds-fs-exit-tooltip-text">Exit Fullscreen</span>
        </>
      }
    />
  );
}

export interface FullscreenButtonProps {
  tooltipPlacement: TooltipPlacement;
}
