<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-seek-button class="vds-button" seconds={-10} slot="trigger">
    <media-icon type="seek-backward-10" />
  </media-seek-button>

  <span slot="content">Seek Backward</span>
</Tooltip>
