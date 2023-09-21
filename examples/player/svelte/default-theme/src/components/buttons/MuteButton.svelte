<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-mute-button class="vds-button" slot="trigger">
    <media-icon class="vds-mute-icon" type="mute" />
    <media-icon class="vds-volume-low-icon" type="volume-low" />
    <media-icon class="vds-volume-high-icon" type="volume-high" />
  </media-mute-button>

  <svelte:fragment slot="content">
    <span class="vds-mute-tooltip-text">Unmute</span>
    <span class="vds-unmute-tooltip-text">Mute</span>
  </svelte:fragment>
</Tooltip>
