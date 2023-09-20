<script setup lang="ts">
import CaptionSubmenu from '../menus/CaptionSubmenu.vue';
import Menu from '../menus/Menu.vue';
</script>

<template>
  <Menu placement="top end" tooltip-placement="top end">
    <template #button>
      <media-icon class="rotate-icon" type="settings" />
    </template>
    <template #content>
      <CaptionSubmenu />
    </template>
    <template #tooltip-content>
      <span>Settings</span>
    </template>
  </Menu>
</template>

<style>
.rotate-icon {
  transition: transform 0.2s ease-out;
}

.media-button[aria-expanded='true'] .rotate-icon {
  transform: rotate(90deg);
  transition: transform 0.2s ease-in;
}
</style>
