<script setup lang="ts">
import SubmenuButton from './SubmenuButton.vue';

const { label } = defineProps<{
  label: string;
}>();
</script>

<template>
  <media-menu>
    <SubmenuButton :label="label">
      <template #icon>
        <slot name="icon" />
      </template>
    </SubmenuButton>
    <media-menu-items
      class="hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block"
    >
      <slot name="content" />
    </media-menu-items>
  </media-menu>
</template>
