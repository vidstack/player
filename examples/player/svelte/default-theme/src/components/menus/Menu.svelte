<script lang="ts">
  import type { MenuPlacement, TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let placement: MenuPlacement;
  export let tooltipPlacement: TooltipPlacement;
</script>

<media-menu class="vds-menu">
  <!-- Menu Button -->
  <Tooltip placement={tooltipPlacement}>
    <media-menu-button class="vds-menu-button vds-button" slot="trigger">
      <slot name="button" />
    </media-menu-button>
    <slot name="tooltip-content" slot="content" />
  </Tooltip>
  <!-- Menu Items -->
  <media-menu-items class="vds-menu-items" {placement}>
    <slot name="content" />
  </media-menu-items>
</media-menu>
