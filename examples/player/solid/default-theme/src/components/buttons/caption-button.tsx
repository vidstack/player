import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function CaptionButton(props: CaptionButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-caption-button class="vds-button">
          <media-icon class="vds-cc-on-icon" type="closed-captions-on" />
          <media-icon class="vds-cc-off-icon" type="closed-captions" />
        </media-caption-button>
      }
      contentSlot={
        <>
          <span class="vds-cc-on-tooltip-text">Closed-Captions Off</span>
          <span class="vds-cc-off-tooltip-text">Closed-Captions On</span>
        </>
      }
    />
  );
}

export interface CaptionButtonProps {
  tooltipPlacement: TooltipPlacement;
}
