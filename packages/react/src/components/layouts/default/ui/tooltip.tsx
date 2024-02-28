import * as React from 'react';

import type { TooltipPlacement } from 'vidstack';

import * as Tooltip from '../../../ui/tooltip';
import { useDefaultLayoutContext } from '../context';

export interface DefaultTooltipProps {
  content: string;
  placement?: TooltipPlacement;
  children: React.ReactNode;
}

function DefaultTooltip({ content, placement, children }: DefaultTooltipProps) {
  const { showTooltipDelay } = useDefaultLayoutContext();
  return (
    <Tooltip.Root showDelay={showTooltipDelay}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content className="vds-tooltip-content" placement={placement}>
        {content}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

DefaultTooltip.displayName = 'DefaultTooltip';
export { DefaultTooltip };
