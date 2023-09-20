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
      <media-play-button class="vds-button">
        <media-icon class="vds-play-icon" type="play" />
        <media-icon class="vds-pause-icon" type="pause" />
      </media-play-button>
    </template>

    <template #content>
      <span class="vds-play-tooltip-text">Play</span>
      <span class="vds-pause-tooltip-text">Pause</span>
    </template>
  </Tooltip>
</template>
