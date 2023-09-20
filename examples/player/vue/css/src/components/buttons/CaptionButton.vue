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
      <media-caption-button class="media-button">
        <media-icon class="on-icon" type="closed-captions-on" />
        <media-icon class="off-icon" type="closed-captions" />
      </media-caption-button>
    </template>

    <template #content>
      <span class="on-tooltip-text">Closed-Captions Off</span>
      <span class="off-tooltip-text">Closed-Captions On</span>
    </template>
  </Tooltip>
</template>

<style scoped>
.media-button:not([data-active]) .on-icon,
.media-button[data-active] .off-icon {
  display: none;
}

media-player:not([data-captions]) .on-tooltip-text,
media-player[data-captions] .off-tooltip-text {
  display: none;
}
</style>
