<script lang="ts">
  import clsx from 'clsx';

  import { offset } from '@floating-ui/dom';

  import { createAriaTooltip, type AriaTooltipOptions } from '../aria/tooltip';

  export let options: AriaTooltipOptions = {
    placement: 'bottom',
  };

  const { tooltipTrigger, tooltipContent, isTooltipOpen } = createAriaTooltip({
    ...options,
    middleware: [offset(8), ...(options.middleware || [])],
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
