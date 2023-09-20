<script setup lang="ts">
import CaptionSubmenu from '../menus/CaptionSubmenu.vue';
import Menu from '../menus/Menu.vue';
</script>

<template>
  <Menu placement="top end" tooltip-placement="top end">
    <template #button>
      <media-icon
        class="h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90"
        type="settings"
      />
    </template>
    <template #content>
      <CaptionSubmenu />
    </template>
    <template #tooltip-content>
      <span>Settings</span>
    </template>
  </Menu>
</template>
