<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-mute-button class="media-button" slot="trigger">
    <media-icon class="mute-icon" type="mute" />
    <media-icon class="volume-low-icon" type="volume-low" />
    <media-icon class="volume-high-icon" type="volume-high" />
  </media-mute-button>

  <svelte:fragment slot="content">
    <span class="mute-tooltip-text">Unmute</span>
    <span class="unmute-tooltip-text">Mute</span>
  </svelte:fragment>
</Tooltip>

<style lang="postcss">
  .media-button {
    &:not([data-muted]) .mute-icon,
    &:not([data-state='low']) .volume-low-icon,
    &:not([data-state='high']) .volume-high-icon {
      display: none;
    }
  }

  :global(media-player:not([data-muted])) .mute-tooltip-text,
  :global(media-player[data-muted]) .unmute-tooltip-text {
    display: none;
  }
</style>
