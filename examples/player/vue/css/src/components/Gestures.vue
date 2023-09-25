<template>
  <media-gesture class="gesture" event="pointerup" action="toggle:paused" />
  <media-gesture class="gesture" event="dblpointerup" action="toggle:fullscreen" />
  <media-gesture class="gesture" event="pointerup" action="toggle:controls" />
  <media-gesture class="gesture" event="dblpointerup" action="seek:-10" />
  <media-gesture class="gesture" event="dblpointerup" action="seek:10" />
</template>

<style scoped>
.gesture {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gesture[action='seek:-10'],
.gesture[action='seek:10'] {
  width: 20%;
  z-index: 1;
}

.gesture[action='seek:10'] {
  left: unset;
  right: 0;
}

/* Remove toggle to pause on touch. */
@media (pointer: coarse) {
  .gesture[action='toggle:paused'] {
    display: none;
  }
}

/* Remove toggle controls on mouse. */
@media not (pointer: coarse) {
  .gesture[action='toggle:controls'] {
    display: none;
  }
}
</style>
