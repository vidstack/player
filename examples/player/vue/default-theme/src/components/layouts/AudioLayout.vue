<script setup lang="ts">
import AudioCaptions from '../AudioCaptions.vue';
import CaptionButton from '../buttons/CaptionButton.vue';
import MuteButton from '../buttons/MuteButton.vue';
import PlayButton from '../buttons/PlayButton.vue';
import SeekBackButton from '../buttons/SeekBackButton.vue';
import SeekForwardButton from '../buttons/SeekForwardButton.vue';
import ChapterTitle from '../ChapterTitle.vue';
import SettingsMenu from '../menus/SettingsMenu.vue';
import TimeSlider from '../sliders/TimeSlider.vue';
import VolumeSlider from '../sliders/VolumeSlider.vue';
import TimeGroup from '../TimeGroup.vue';
</script>

<template>
  <AudioCaptions />

  <media-controls class="vds-controls controls">
    <!-- Top Controls Group -->
    <media-controls-group class="vds-controls-group controls-group">
      <TimeSlider />
    </media-controls-group>
    <!-- Lower Controls Group -->
    <media-controls-group class="vds-controls-group controls-group">
      <SeekBackButton tooltip-placement="top start" />
      <PlayButton tooltip-placement="top" />
      <SeekForwardButton tooltip-placement="top" />
      <TimeGroup />
      <ChapterTitle />
      <MuteButton tooltip-placement="top" />
      <VolumeSlider />
      <CaptionButton tooltip-placement="top" />
      <SettingsMenu placement="top end" tooltip-placement="top end" />
    </media-controls-group>
  </media-controls>
</template>

<style scoped>
.controls {
  border-radius: var(--media-border-radius);
}

media-player[data-focus]:not([data-playing]) .controls {
  box-shadow: var(--media-focus-ring);
}

.controls :deep(media-time-slider) {
  --media-slider-height: 36px;
  --media-slider-preview-offset: 8px;
}

.controls :deep(media-mute-button) {
  margin-right: 2.5px;
}

.controls :deep(media-volume-slider) {
  --media-slider-width: 72px;
  --media-slider-height: 40px;
  --media-slider-preview-offset: 40px;
  margin-left: 1.5px;
  margin-right: 8px;
}

.controls-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.controls-group:nth-child(2) {
  padding-inline: 8px;
  padding-bottom: 8px;
}
</style>
