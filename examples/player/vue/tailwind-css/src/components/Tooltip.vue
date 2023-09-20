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
    <media-tooltip-content
      class="tooltip animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white"
      :placement="placement"
    >
      <slot name="content" />
    </media-tooltip-content>
  </media-tooltip>
</template>

<style scoped>
media-menu[data-open] .tooltip {
  display: none !important;
}
</style>
