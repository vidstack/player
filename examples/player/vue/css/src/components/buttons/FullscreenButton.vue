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
      <media-fullscreen-button class="media-button">
        <media-icon class="enter-icon" type="fullscreen" />
        <media-icon class="exit-icon" type="fullscreen-exit" />
      </media-fullscreen-button>
    </template>

    <template #content>
      <span class="enter-tooltip-text">Enter Fullscreen</span>
      <span class="exit-tooltip-text">Exit Fullscreen</span>
    </template>
  </Tooltip>
</template>

<style scoped>
.media-button[data-active] .enter-icon,
.media-button:not([data-active]) .exit-icon {
  display: none;
}

media-player[data-fullscreen] .enter-tooltip-text,
media-player:not([data-fullscreen]) .exit-tooltip-text {
  display: none;
}
</style>
