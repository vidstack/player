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
      <media-seek-button class="vds-button" :seconds="10">
        <media-icon type="seek-forward-10" />
      </media-seek-button>
    </template>

    <template #content>
      <span>Seek Forward</span>
    </template>
  </Tooltip>
</template>
