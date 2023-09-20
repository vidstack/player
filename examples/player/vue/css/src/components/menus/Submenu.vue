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
    <media-menu-items class="content">
      <slot name="content" />
    </media-menu-items>
  </media-menu>
</template>

<style scoped>
.content {
  display: inline-block;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-top: 12px;
}

.content[aria-hidden='true'] {
  display: none;
}
</style>
