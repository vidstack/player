<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-play-button
    class="ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4"
    slot="trigger"
  >
    <media-icon class="media-paused:block hidden h-8 w-8" type="play" />
    <media-icon class="media-paused:hidden h-8 w-8" type="pause" />
  </media-play-button>

  <svelte:fragment slot="content">
    <span class="media-paused:block hidden">Play</span>
    <span class="media-paused:hidden">Pause</span>
  </svelte:fragment>
</Tooltip>
