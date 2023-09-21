<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-fullscreen-button class="media-button" slot="trigger">
    <media-icon class="enter-icon" type="fullscreen" />
    <media-icon class="exit-icon" type="fullscreen-exit" />
  </media-fullscreen-button>

  <svelte:fragment slot="content">
    <span class="enter-tooltip-text">Enter Fullscreen</span>
    <span class="exit-tooltip-text">Exit Fullscreen</span>
  </svelte:fragment>
</Tooltip>

<style lang="postcss">
  .media-button {
    &[data-active] .enter-icon,
    &:not([data-active]) .exit-icon {
      display: none;
    }
  }

  :global(media-player[data-fullscreen]) .enter-tooltip-text,
  :global(media-player:not([data-fullscreen])) .exit-tooltip-text {
    display: none;
  }
</style>
