<template>
  <media-slider-chapters class="chapters">
    <template>
      <div class="chapter">
        <div class="track" />
        <div class="track-fill track" />
        <div class="progress track" />
      </div>
    </template>
  </media-slider-chapters>
</template>

<style scoped>
.chapters {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  contain: layout style;
  border-radius: 1px;
}

.chapter {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  will-change: height, transform;
  contain: layout style;
  border-radius: 1px;
  margin-right: 2px;
}

.chapter:last-child {
  margin-right: 0;
}

.track {
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 5px;
  top: 50%;
  left: 0;
  border-radius: 1px;
  transform: translateY(-50%) translateZ(0);
  background-color: rgb(255 255 255 / 0.3);
  contain: strict;
}

.media-slider[data-focus] .track {
  box-shadow: var(--media-focus-ring);
}

.track-fill {
  z-index: 2; /** above track and track progress. */
  background-color: var(--media-brand);
  width: var(--chapter-fill, 0%);
  will-change: width;
}

.progress {
  width: var(--chapter-progress, 0%);
  will-change: width;
  background-color: rgb(255 255 255 / 0.5);
}
</style>
