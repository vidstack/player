<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-pip-button class="vds-button" slot="trigger">
    <media-icon class="vds-pip-enter-icon" type="picture-in-picture" />
    <media-icon class="vds-pip-exit-icon" type="picture-in-picture-exit" />
  </media-pip-button>

  <svelte:fragment slot="content">
    <span class="vds-pip-enter-tooltip-text">Enter PIP</span>
    <span class="vds-pip-exit-tooltip-text">Exit PIP</span>
  </svelte:fragment>
</Tooltip>
