<script setup lang="ts">
import MenuRadio from './MenuRadio.vue';
import Submenu from './Submenu.vue';
</script>

<template>
  <Submenu label="Captions">
    <template #icon>
      <media-icon class="h-5 w-5" type="closed-captions" />
    </template>
    <template #content>
      <media-captions-radio-group class="w-full flex flex-col">
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </template>
  </Submenu>
</template>
