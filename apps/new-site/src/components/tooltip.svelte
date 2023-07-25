<script lang="ts">
  import { createTooltip } from '@melt-ui/svelte';
  import type { FloatingConfig } from '@melt-ui/svelte/internal/actions';
  import { fade } from 'svelte/transition';

  export let position: FloatingConfig = {};

  const {
    trigger: tooltipTrigger,
    content: tooltipContent,
    open: isTooltipOpen,
  } = createTooltip({
    positioning: position,
    openDelay: 300,
    closeDelay: 0,
    arrowSize: 8,
  });
</script>

<svelte:element
  this={'href' in $$restProps ? 'a' : 'button'}
  {...$$restProps}
  {...$tooltipTrigger}
  use:tooltipTrigger
>
  <slot name="trigger" />
</svelte:element>

{#if $isTooltipOpen}
  <div
    transition:fade={{ duration: 100 }}
    class="z-10 rounded-sm border border-border bg-body text-xs font-medium px-1.5 py-1"
    {...$tooltipContent}
    use:tooltipContent
  >
    <slot name="content" />
  </div>
{/if}
