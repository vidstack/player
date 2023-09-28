<template>
  <media-captions class="vds-captions" />
</template>

<style scoped>
media-captions {
  --cue-font-size: 14px;
  display: inline-block;
  position: absolute;
  width: 100%;
  top: unset;
  bottom: calc(100% + 2px);
  text-align: center;
  background-color: transparent;
}

media-captions :deep([data-part='cue']) {
  color: white;
  border: rgb(255 255 255 / 0.1);
  background-color: black;
}

/* Hide captions when interacting with time slider. */
media-player[data-preview] media-captions {
  opacity: 0;
}
</style>
