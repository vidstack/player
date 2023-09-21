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
      <media-fullscreen-button
        class="ring-media-focus group relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
      >
        <media-icon class="media-fullscreen:hidden h-8 w-8" type="fullscreen" />
        <media-icon class="media-fullscreen:block hidden h-8 w-8" type="fullscreen-exit" />
      </media-fullscreen-button>
    </template>

    <template #content>
      <span class="media-fullscreen:hidden">Enter Fullscreen</span>
      <span class="media-fullscreen:block hidden">Exit Fullscreen</span>
    </template>
  </Tooltip>
</template>
