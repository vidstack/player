<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-caption-button
    class="ring-media-focus group relative mr-0.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
    slot="trigger"
  >
    <media-icon class="media-captions:block hidden h-8 w-8" type="closed-captions-on" />
    <media-icon class="media-captions:hidden h-8 w-8" type="closed-captions" />
  </media-caption-button>

  <svelte:fragment slot="content">
    <span class="media-captions:block hidden">Closed-Captions Off</span>
    <span class="media-captions:hidden">Closed-Captions On</span>
  </svelte:fragment>
</Tooltip>
