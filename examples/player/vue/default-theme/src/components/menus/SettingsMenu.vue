<script setup lang="ts">
import CaptionSubmenu from '../menus/CaptionSubmenu.vue';
import Menu from '../menus/Menu.vue';
</script>

<template>
  <Menu placement="top end" tooltip-placement="top end">
    <template #button>
      <media-icon class="vds-rotate-icon" type="settings" />
    </template>
    <template #content>
      <CaptionSubmenu />
    </template>
    <template #tooltip-content>
      <span>Settings</span>
    </template>
  </Menu>
</template>
