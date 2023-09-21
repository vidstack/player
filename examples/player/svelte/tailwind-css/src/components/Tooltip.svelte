<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  export let placement: TooltipPlacement;
</script>

<media-tooltip>
  <media-tooltip-trigger>
    <slot name="trigger" />
  </media-tooltip-trigger>
  <media-tooltip-content
    class="tooltip animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white"
    {placement}
  >
    <slot name="content" />
  </media-tooltip-content>
</media-tooltip>

<style>
  :global(media-menu[data-open]) .tooltip {
    display: none !important;
  }
</style>
