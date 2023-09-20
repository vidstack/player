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
      <media-mute-button class="vds-button">
        <media-icon class="vds-mute-icon" type="mute" />
        <media-icon class="vds-volume-low-icon" type="volume-low" />
        <media-icon class="vds-volume-high-icon" type="volume-high" />
      </media-mute-button>
    </template>

    <template #content>
      <span class="vds-mute-tooltip-text">Unmute</span>
      <span class="vds-unmute-tooltip-text">Mute</span>
    </template>
  </Tooltip>
</template>
