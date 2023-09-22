import type { JSX } from 'solid-js';
import type { TooltipPlacement } from 'vidstack';

export function Tooltip(props: TooltipProps) {
  return (
    <media-tooltip>
      <media-tooltip-trigger>{props.triggerSlot}</media-tooltip-trigger>
      <media-tooltip-content
        class="tooltip animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white"
        placement={props.placement}
      >
        {props.contentSlot}
      </media-tooltip-content>
    </media-tooltip>
  );
}

export interface TooltipProps {
  triggerSlot: JSX.Element;
  contentSlot: JSX.Element;
  placement: TooltipPlacement;
}
