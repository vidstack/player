<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-pip-button class="media-button" slot="trigger">
    <media-icon class="enter-icon" type="picture-in-picture" />
    <media-icon class="exit-icon" type="picture-in-picture-exit" />
  </media-pip-button>

  <svelte:fragment slot="content">
    <span class="enter-tooltip-text">Enter PIP</span>
    <span class="exit-tooltip-text">Exit PIP</span>
  </svelte:fragment>
</Tooltip>

<style lang="postcss">
  .media-button {
    &[data-active] .enter-icon,
    &:not([data-active]) .exit-icon {
      display: none;
    }
  }

  :global(media-player[data-pip]) .enter-tooltip-text,
  :global(media-player:not([data-pip])) .exit-tooltip-text {
    display: none;
  }
</style>
