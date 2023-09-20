<template>
  <div class="thumb" />
</template>

<style scoped>
.thumb {
  position: absolute;
  top: 50%;
  left: var(--slider-fill);
  opacity: 0;
  contain: layout size style;
  width: 15px;
  height: 15px;
  border: 1px solid #cacaca;
  border-radius: 9999px;
  background-color: #fff;
  transform: translate(-50%, -50%) translateZ(0);
  transition: opacity 0.15s ease-in;
  pointer-events: none;
  will-change: left;
  z-index: 2; /** above track fill. */
}

.media-slider[data-active] .thumb {
  opacity: 1;
  transition: opacity 0.2s ease-in;
}

.media-slider[data-dragging] .thumb {
  box-shadow: 0 0 0 3px hsla(0, 0%, 100%, 0.4);
}
</style>
