<script setup lang="ts">
import type { MenuPlacement, TooltipPlacement } from 'vidstack';

import Tooltip from '../Tooltip.vue';

const { placement, tooltipPlacement } = defineProps<{
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}>();
</script>

<template>
  <media-menu>
    <!-- Menu Button -->
    <Tooltip :placement="tooltipPlacement">
      <template #trigger>
        <media-menu-button class="media-button button">
          <slot name="button" />
        </media-menu-button>
      </template>
      <template #content>
        <slot name="tooltip-content" />
      </template>
    </Tooltip>
    <!-- Menu Items -->
    <media-menu-items class="content" :placement="placement">
      <slot name="content" />
    </media-menu-items>
  </media-menu>
</template>

<style scoped>
.content {
  --enter-transform: translateY(0px);
  --exit-transform: translateY(12px);

  display: flex;
  font-size: 15px;
  font-weight: 500;
  font-family: sans-serif;
  flex-direction: column;
  transition: height 0.35s ease;
  min-width: 260px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgb(255 255 255 / 0.1);
  background-color: rgb(10 10 10 / 0.95);
  backdrop-filter: blur(4px);
  height: var(--menu-height, auto);
  will-change: width, height;
  overflow-y: auto;
  overscroll-behavior: contain;
  opacity: 0;
  max-height: 250px;
}

.content[data-resizing] {
  overflow: hidden;
  pointer-events: none;
}

.content:not([data-open]) {
  animation: media-menu-exit 0.2s ease-out;
}

.content[data-open] {
  animation: media-menu-enter 0.3s ease-out;
  animation-fill-mode: forwards;
}

.content[data-placement~='bottom'] {
  --enter-transform: translateY(0);
  --exit-transform: translateY(-12px);
}

.content :where([role='menuitem'][data-focus], [role='menuitemradio'][data-focus]) {
  outline: none;
  box-shadow: var(--media-focus-ring);
}

@keyframes media-menu-enter {
  from {
    opacity: 0;
    transform: var(--exit-transform);
  }
  to {
    opacity: 1;
    transform: var(--enter-transform);
  }
}

@keyframes media-menu-exit {
  from {
    opacity: 1;
    transform: var(--enter-transform);
  }
  to {
    opacity: 0;
    transform: var(--exit-transform);
  }
}
</style>
