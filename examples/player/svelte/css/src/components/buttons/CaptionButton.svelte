<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-caption-button class="media-button" slot="trigger">
    <media-icon class="on-icon" type="closed-captions-on" />
    <media-icon class="off-icon" type="closed-captions" />
  </media-caption-button>

  <svelte:fragment slot="content">
    <span class="on-tooltip-text">Closed-Captions Off</span>
    <span class="off-tooltip-text">Closed-Captions On</span>
  </svelte:fragment>
</Tooltip>

<style lang="postcss">
  .media-button {
    &:not([data-active]) .on-icon,
    &[data-active] .off-icon {
      display: none;
    }
  }

  :global(media-player:not([data-captions])) .on-tooltip-text,
  :global(media-player[data-captions]) .off-tooltip-text {
    display: none;
  }
</style>
