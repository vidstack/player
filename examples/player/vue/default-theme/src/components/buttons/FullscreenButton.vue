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
      <media-fullscreen-button class="vds-button">
        <media-icon class="vds-fs-enter-icon" type="fullscreen" />
        <media-icon class="vds-fs-exit-icon" type="fullscreen-exit" />
      </media-fullscreen-button>
    </template>

    <template #content>
      <span class="vds-fs-enter-tooltip-text">Enter Fullscreen</span>
      <span class="vds-fs-exit-tooltip-text">Exit Fullscreen</span>
    </template>
  </Tooltip>
</template>
