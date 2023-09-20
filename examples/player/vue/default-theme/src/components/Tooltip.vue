<script setup lang="ts">
import type { TooltipPlacement } from 'vidstack';

const { placement } = defineProps<{
  placement: TooltipPlacement;
}>();
</script>

<template>
  <media-tooltip>
    <media-tooltip-trigger>
      <slot name="trigger" />
    </media-tooltip-trigger>
    <media-tooltip-content class="vds-tooltip-content" :placement="placement">
      <slot name="content" />
    </media-tooltip-content>
  </media-tooltip>
</template>
