<script setup lang="ts">
import SubmenuButton from './SubmenuButton.vue';

const { label } = defineProps<{
  label: string;
}>();
</script>

<template>
  <media-menu class="vds-menu">
    <SubmenuButton :label="label">
      <template #icon>
        <slot name="icon" />
      </template>
    </SubmenuButton>
    <media-menu-items class="vds-menu-items">
      <slot name="content" />
    </media-menu-items>
  </media-menu>
</template>
