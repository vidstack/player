<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-caption-button class="vds-button" slot="trigger">
    <media-icon class="vds-cc-on-icon" type="closed-captions-on" />
    <media-icon class="vds-cc-off-icon" type="closed-captions" />
  </media-caption-button>

  <svelte:fragment slot="content">
    <span class="vds-cc-on-tooltip-text">Closed-Captions Off</span>
    <span class="vds-cc-off-tooltip-text">Closed-Captions On</span>
  </svelte:fragment>
</Tooltip>
