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
      <media-pip-button class="vds-button">
        <media-icon class="vds-pip-enter-icon" type="picture-in-picture" />
        <media-icon class="vds-pip-exit-icon" type="picture-in-picture-exit" />
      </media-pip-button>
    </template>

    <template #content>
      <span class="vds-pip-enter-tooltip-text">Enter PIP</span>
      <span class="vds-pip-exit-tooltip-text">Exit PIP</span>
    </template>
  </Tooltip>
</template>
