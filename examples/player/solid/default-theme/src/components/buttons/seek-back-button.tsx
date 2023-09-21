import type { TooltipPlacement } from 'vidstack';

import { Tooltip } from '../tooltip';

export function SeekBackButton(props: SeekBackButtonProps) {
  return (
    <Tooltip
      placement={props.tooltipPlacement}
      triggerSlot={
        <media-seek-button class="vds-button" seconds={-10}>
          <media-icon type="seek-backward-10" />
        </media-seek-button>
      }
      contentSlot={<span>Seek Backward</span>}
    />
  );
}

export interface SeekBackButtonProps {
  tooltipPlacement: TooltipPlacement;
}
