<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-fullscreen-button class="vds-button" slot="trigger">
    <media-icon class="vds-fs-enter-icon" type="fullscreen" />
    <media-icon class="vds-fs-exit-icon" type="fullscreen-exit" />
  </media-fullscreen-button>

  <svelte:fragment slot="content">
    <span class="vds-fs-enter-tooltip-text">Enter Fullscreen</span>
    <span class="vds-fs-exit-tooltip-text">Exit Fullscreen</span>
  </svelte:fragment>
</Tooltip>
