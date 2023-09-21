<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  export let placement: TooltipPlacement;
</script>

<media-tooltip>
  <media-tooltip-trigger>
    <slot name="trigger" />
  </media-tooltip-trigger>
  <media-tooltip-content class="vds-tooltip-content" {placement}>
    <slot name="content" />
  </media-tooltip-content>
</media-tooltip>
