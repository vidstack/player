<script setup lang="ts">
import CaptionButton from '../buttons/CaptionButton.vue';
import FullscreenButton from '../buttons/FullscreenButton.vue';
import MuteButton from '../buttons/MuteButton.vue';
import PIPButton from '../buttons/PIPButton.vue';
import PlayButton from '../buttons/PlayButton.vue';
import Captions from '../Captions.vue';
import ChapterTitle from '../ChapterTitle.vue';
import Gestures from '../Gestures.vue';
import SettingsMenu from '../menus/SettingsMenu.vue';
import TimeSlider from '../sliders/TimeSlider.vue';
import VolumeSlider from '../sliders/VolumeSlider.vue';
import TimeGroup from '../TimeGroup.vue';

const { thumbnails } = defineProps<{
  thumbnails?: string;
}>();
</script>

<template>
  <Gestures />
  <Captions />
  <media-controls class="controls">
    <div class="spacer" />
    <media-controls-group class="controls-group">
      <TimeSlider :thumbnails="thumbnails" />
    </media-controls-group>
    <media-controls-group class="controls-group">
      <PlayButton tooltip-placement="top start" />
      <MuteButton tooltip-placement="top" />
      <VolumeSlider />
      <TimeGroup />
      <ChapterTitle />
      <div class="spacer" />
      <CaptionButton tooltip-placement="top" />
      <SettingsMenu placement="top end" tooltip-placement="top" />
      <PIPButton tooltip-placement="top" />
      <FullscreenButton tooltip-placement="top end" />
    </media-controls-group>
  </media-controls>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.controls[data-visible] {
  opacity: 1;
  background-image: linear-gradient(
    to top,
    rgb(0 0 0 / 0.5),
    10%,
    transparent,
    95%,
    rgb(0 0 0 / 0.3)
  );
}

.controls-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.controls-group {
  padding-inline: 8px;
}

.controls-group:last-child {
  margin-top: -4px;
  padding-bottom: 8px;
}

.spacer {
  flex: 1 1 0%;
  pointer-events: none;
}

.controls :deep(.media-button) {
  margin-right: 2.5px;
}

.controls :deep(media-mute-button) {
  margin-left: -2.5px;
  margin-right: -5px !important;
}

.controls :deep(media-fullscreen-button) {
  margin-right: 0 !important;
}
</style>
