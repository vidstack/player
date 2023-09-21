<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-fullscreen-button
    class="ring-media-focus group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
    slot="trigger"
  >
    <media-icon class="media-fullscreen:hidden h-8 w-8" type="fullscreen" />
    <media-icon class="media-fullscreen:block hidden h-8 w-8" type="fullscreen-exit" />
  </media-fullscreen-button>

  <svelte:fragment slot="content">
    <span class="media-fullscreen:hidden">Enter Fullscreen</span>
    <span class="media-fullscreen:block hidden">Exit Fullscreen</span>
  </svelte:fragment>
</Tooltip>
