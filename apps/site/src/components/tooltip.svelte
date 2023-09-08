<script lang="ts">
  import clsx from 'clsx';

  import { type Placement } from '@floating-ui/dom';

  import { createAriaTooltip } from '../aria/tooltip';

  export let placement: Placement = 'bottom';
  export let offset = 8;

  const { tooltipTrigger, tooltipContent, isTooltipOpen } = createAriaTooltip({
    placement,
    offset,
  });
</script>

<svelte:element this={'href' in $$restProps ? 'a' : 'button'} {...$$restProps} use:tooltipTrigger>
  <slot name="trigger" />
</svelte:element>

<div
  class={clsx(
    'z-10 rounded-md border border-border/90 bg-elevate text-xs font-medium px-1.5 py-1 shadow-sm',
    $isTooltipOpen
      ? 'animate-in fade-in slide-in-from-top-4'
      : 'animate-out fade-out slide-out-to-top-2',
  )}
  style="display: none;"
  use:tooltipContent
>
  <slot name="content" />
</div>
