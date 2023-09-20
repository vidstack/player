<script setup lang="ts">
import SliderChapters from './SliderChapters.vue';
import SliderPreview from './SliderPreview.vue';
import SliderThumb from './SliderThumb.vue';

const { thumbnails } = defineProps<{
  thumbnails?: string;
}>();
</script>

<template>
  <media-time-slider class="media-slider">
    <SliderChapters />
    <SliderThumb />
    <SliderPreview :thumbnails="thumbnails">
      <div class="chapter-title" data-part="chapter-title" />
      <media-slider-value class="value" type="pointer" format="time" />
    </SliderPreview>
  </media-time-slider>
</template>

<style scoped>
.media-slider {
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 40px;
  position: relative;
  contain: layout style;
  outline: none;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  /** Prevent thumb flowing out of slider (15px = thumb width). */
  margin: 0 calc(15px / 2);
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.chapter-title {
  margin-top: 8px;
  font-size: 14px;
}

.value {
  font-size: 13px;
  margin-top: 2px;
}
</style>
