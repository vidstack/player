<template>
  <media-captions class="vds-captions" />
</template>

<style scoped>
media-captions {
  z-index: 10;
  bottom: 0;
  transition: bottom 0.15s linear;
}

/* Pull captions up when controls are visible. */
media-player[data-controls] media-captions {
  bottom: 80px;
}

/* Hide captions when interacting with time slider. */
media-player[data-preview] media-captions {
  opacity: 0;
}
</style>
