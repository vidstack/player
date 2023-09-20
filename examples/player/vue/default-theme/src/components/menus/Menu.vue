<script setup lang="ts">
import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import Tooltip from '../Tooltip.vue';

const { placement, tooltipPlacement } = defineProps<{
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}>();
</script>

<template>
  <media-menu class="vds-menu">
    <!-- Menu Button -->
    <Tooltip :placement="tooltipPlacement">
      <template #trigger>
        <media-menu-button class="vds-menu-button vds-button">
          <slot name="button" />
        </media-menu-button>
      </template>
      <template #content>
        <slot name="tooltip-content" />
      </template>
    </Tooltip>
    <!-- Menu Items -->
    <media-menu-items class="vds-menu-items" :placement="placement">
      <slot name="content" />
    </media-menu-items>
  </media-menu>
</template>
