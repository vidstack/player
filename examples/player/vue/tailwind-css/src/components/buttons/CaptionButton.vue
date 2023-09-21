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
      <media-caption-button
        class="ring-media-focus group relative mr-0.5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
      >
        <media-icon class="media-captions:block hidden h-8 w-8" type="closed-captions-on" />
        <media-icon class="media-captions:hidden h-8 w-8" type="closed-captions" />
      </media-caption-button>
    </template>

    <template #content>
      <span class="media-captions:block hidden">Closed-Captions Off</span>
      <span class="media-captions:hidden">Closed-Captions On</span>
    </template>
  </Tooltip>
</template>
