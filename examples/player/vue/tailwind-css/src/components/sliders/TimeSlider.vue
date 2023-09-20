<script setup lang="ts">
import SliderChapters from './SliderChapters.vue';
import SliderPreview from './SliderPreview.vue';
import SliderThumb from './SliderThumb.vue';

const { thumbnails } = defineProps<{
  thumbnails?: string;
}>();
</script>

<template>
  <media-time-slider
    class="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none"
  >
    <SliderChapters />
    <SliderThumb />
    <SliderPreview :thumbnails="thumbnails">
      <div class="mt-2 text-sm" data-part="chapter-title" />
      <media-slider-value class="text-[13px]" type="pointer" format="time" />
    </SliderPreview>
  </media-time-slider>
</template>
