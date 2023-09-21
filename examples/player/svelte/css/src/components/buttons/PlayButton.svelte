<script lang="ts">
  import type { TooltipPlacement } from 'vidstack';

  import Tooltip from '../Tooltip.svelte';

  export let tooltipPlacement: TooltipPlacement;
</script>

<Tooltip placement={tooltipPlacement}>
  <media-play-button class="media-button" slot="trigger">
    <media-icon class="play-icon" type="play" />
    <media-icon class="pause-icon" type="pause" />
  </media-play-button>

  <svelte:fragment slot="content">
    <span class="play-tooltip-text">Play</span>
    <span class="pause-tooltip-text">Pause</span>
  </svelte:fragment>
</Tooltip>

<style lang="postcss">
  .media-button {
    &:not([data-paused]) .play-icon,
    &[data-ended] .play-icon,
    &[data-paused] .pause-icon,
    &[data-ended] .pause-icon,
    &:not([data-ended]) .replay-icon {
      display: none;
    }
  }

  :global(media-player:not([data-paused])) .play-tooltip-text,
  :global(media-player[data-paused]) .pause-tooltip-text {
    display: none;
  }
</style>
