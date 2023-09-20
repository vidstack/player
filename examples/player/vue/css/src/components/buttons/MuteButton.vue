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
      <media-mute-button class="media-button">
        <media-icon class="mute-icon" type="mute" />
        <media-icon class="volume-low-icon" type="volume-low" />
        <media-icon class="volume-high-icon" type="volume-high" />
      </media-mute-button>
    </template>

    <template #content>
      <span class="mute-tooltip-text">Unmute</span>
      <span class="unmute-tooltip-text">Mute</span>
    </template>
  </Tooltip>
</template>

<style scoped>
.media-button:not([data-muted]) .mute-icon,
.media-button:not([data-state='low']) .volume-low-icon,
.media-button:not([data-state='high']) .volume-high-icon {
  display: none;
}

media-player:not([data-muted]) .mute-tooltip-text,
media-player[data-muted] .unmute-tooltip-text {
  display: none;
}
</style>
