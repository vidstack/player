<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-play-button class="vds-button" slot="trigger">
    <media-icon class="vds-play-icon" type="play" />
    <media-icon class="vds-pause-icon" type="pause" />
  </media-play-button>

  <svelte:fragment slot="content">
    <span class="vds-play-tooltip-text">Play</span>
    <span class="vds-pause-tooltip-text">Pause</span>
  </svelte:fragment>
</Tooltip>
