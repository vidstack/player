<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-pip-button
    class="ring-media-focus group relative mr-0.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
    slot="trigger"
  >
    <media-icon class="media-pip:hidden h-8 w-8" type="picture-in-picture" />
    <media-icon class="media-pip:block hidden h-8 w-8" type="picture-in-picture-exit" />
  </media-pip-button>

  <svelte:fragment slot="content">
    <span class="media-pip:hidden">Enter PIP</span>
    <span class="media-pip:block hidden">Exit PIP</span>
  </svelte:fragment>
</Tooltip>
