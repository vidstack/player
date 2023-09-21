<script setup lang="ts">
import MenuRadio from './MenuRadio.vue';
import Submenu from './Submenu.vue';
</script>

<template>
  <Submenu label="Captions">
    <template #icon>
      <media-icon class="vds-menu-button-icon" type="closed-captions" />
    </template>
    <template #content>
      <media-captions-radio-group class="vds-captions-radio-group vds-radio-group">
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </template>
  </Submenu>
</template>
