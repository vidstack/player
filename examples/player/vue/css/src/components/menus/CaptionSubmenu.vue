<script setup lang="ts">
import MenuRadio from './MenuRadio.vue';
import Submenu from './Submenu.vue';
</script>

<template>
  <Submenu label="Captions">
    <template #icon>
      <media-icon class="icon" type="closed-captions" />
    </template>
    <template #content>
      <media-captions-radio-group class="radio-group">
        <template>
          <MenuRadio />
        </template>
      </media-captions-radio-group>
    </template>
  </Submenu>
</template>

<style scoped>
.icon {
  width: 22px;
  height: 22px;
}

.radio-group {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
