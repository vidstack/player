<script setup lang="ts">
const { thumbnails } = defineProps<{
  thumbnails?: string;
}>();
</script>

<template>
  <media-time-slider class="vds-time-slider vds-slider">
    <media-slider-chapters class="vds-slider-chapters">
      <template>
        <div class="vds-slider-chapter">
          <div class="vds-slider-track" />
          <div class="vds-slider-track-fill vds-slider-track" />
          <div class="vds-slider-progress vds-slider-track" />
        </div>
      </template>
    </media-slider-chapters>

    <div class="vds-slider-thumb" />

    <!-- Slider Preview -->
    <media-slider-preview class="vds-slider-preview">
      <media-slider-thumbnail
        class="vds-slider-thumbnail vds-thumbnail"
        :src="thumbnails"
        v-if="thumbnails"
      />

      <div class="vds-slider-chapter-title" data-part="chapter-title" />

      <media-slider-value class="vds-slider-value" type="pointer" format="time" />
    </media-slider-preview>
  </media-time-slider>
</template>
