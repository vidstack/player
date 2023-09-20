<template>
  <media-volume-slider class="vds-slider">
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <media-slider-preview class="vds-slider-preview" no-clamp>
      <media-slider-value
        class="vds-slider-value"
        type="pointer"
        format="percent"
      ></media-slider-value>
    </media-slider-preview>
    <div class="vds-slider-thumb"></div>
  </media-volume-slider>
</template>
