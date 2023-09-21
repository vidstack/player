import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function SeekForwardButton(props: SeekForwardButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-seek-button class="vds-button" seconds={10}>
          <media-icon type="seek-forward-10" />
        </media-seek-button>
      }
      contentSlot={<span>Seek Forward</span>}
    />
  );
}

export interface SeekForwardButtonProps {
  tooltipPlacement: TooltipPlacement;
}
