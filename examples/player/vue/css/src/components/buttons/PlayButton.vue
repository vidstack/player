<script setup lang="ts">
import type { TooltipPlacement } from 'vidstack';

import Tooltip from '../Tooltip.vue';

const { tooltipPlacement } = defineProps<{
  tooltipPlacement: TooltipPlacement;
}>();
</script>

<template>
  <Tooltip :placement="tooltipPlacement">
    <template #trigger>
      <media-play-button class="media-button">
        <media-icon class="play-icon" type="play" />
        <media-icon class="pause-icon" type="pause" />
      </media-play-button>
    </template>

    <template #content>
      <span class="play-tooltip-text">Play</span>
      <span class="pause-tooltip-text">Pause</span>
    </template>
  </Tooltip>
</template>

<style scoped>
.media-button:not([data-paused]) .play-icon,
.media-button[data-ended] .play-icon,
.media-button[data-paused] .pause-icon,
.media-button[data-ended] .pause-icon,
.media-button:not([data-ended]) .replay-icon {
  display: none;
}

media-player:not([data-paused]) .play-tooltip-text,
media-player[data-paused] .pause-tooltip-text {
  display: none;
}
</style>
