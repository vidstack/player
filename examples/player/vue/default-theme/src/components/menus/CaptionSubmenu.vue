<script setup lang="ts">
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
          <media-radio class="vds-radio">
            <div class="vds-radio-check"></div>
            <span class="vds-radio-label" data-part="label"></span>
          </media-radio>
        </template>
      </media-captions-radio-group>
    </template>
  </Submenu>
</template>
