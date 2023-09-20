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
      <media-caption-button class="vds-button">
        <media-icon class="vds-cc-on-icon" type="closed-captions-on" />
        <media-icon class="vds-cc-off-icon" type="closed-captions" />
      </media-caption-button>
    </template>

    <template #content>
      <span class="vds-cc-on-tooltip-text">Closed-Captions Off</span>
      <span class="vds-cc-off-tooltip-text">Closed-Captions On</span>
    </template>
  </Tooltip>
</template>
