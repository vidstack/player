import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function PIPButton(props: PIPButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-pip-button class="vds-button">
          <media-icon class="vds-pip-enter-icon" type="picture-in-picture" />
          <media-icon class="vds-pip-exit-icon" type="picture-in-picture-exit" />
        </media-pip-button>
      }
      contentSlot={
        <>
          <span class="vds-pip-enter-tooltip-text">Enter PIP</span>
          <span class="vds-pip-exit-tooltip-text">Exit PIP</span>
        </>
      }
    />
  );
}

export interface PIPButtonProps {
  tooltipPlacement: TooltipPlacement;
}
