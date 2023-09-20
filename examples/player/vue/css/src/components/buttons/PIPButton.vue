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
      <media-pip-button class="media-button">
        <media-icon class="enter-icon" type="picture-in-picture" />
        <media-icon class="exit-icon" type="picture-in-picture-exit" />
      </media-pip-button>
    </template>

    <template #content>
      <span class="enter-tooltip-text">Enter PIP</span>
      <span class="exit-tooltip-text">Exit PIP</span>
    </template>
  </Tooltip>
</template>

<style scoped>
.media-button[data-active] .enter-icon,
.media-button:not([data-active]) .exit-icon {
  display: none;
}

media-player[data-pip] .enter-tooltip-text,
media-player:not([data-pip]) .exit-tooltip-text {
  display: none;
}
</style>
