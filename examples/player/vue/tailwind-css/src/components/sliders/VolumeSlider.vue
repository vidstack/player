<script setup lang="ts">
import SliderPreview from './SliderPreview.vue';
import SliderThumb from './SliderThumb.vue';
</script>

<template>
  <media-volume-slider
    class="group relative mx-[7.5px] inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none aria-hidden:hidden"
  >
    <!-- Track -->
    <div
      class="ring-media-focus relative z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]"
    >
      <div
        class="bg-media-brand absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width]"
      />
    </div>
    <SliderThumb />
    <SliderPreview no-clamp>
      <media-slider-value
        class="rounded-sm bg-black px-2 py-px text-[13px] font-medium"
        type="pointer"
        format="percent"
      />
    </SliderPreview>
  </media-volume-slider>
</template>
