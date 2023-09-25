<script lang="ts">
  import AudioCaptions from '../AudioCaptions.svelte';
  import CaptionButton from '../buttons/CaptionButton.svelte';
  import MuteButton from '../buttons/MuteButton.svelte';
  import PlayButton from '../buttons/PlayButton.svelte';
  import SeekBackButton from '../buttons/SeekBackButton.svelte';
  import SeekForwardButton from '../buttons/SeekForwardButton.svelte';
  import ChapterTitle from '../ChapterTitle.svelte';
  import SettingsMenu from '../menus/SettingsMenu.svelte';
  import TimeSlider from '../sliders/TimeSlider.svelte';
  import VolumeSlider from '../sliders/VolumeSlider.svelte';
  import TimeGroup from '../TimeGroup.svelte';
</script>

<AudioCaptions />

<media-controls class="vds-controls controls">
  <!-- Top Controls Group -->
  <media-controls-group class="vds-controls-group controls-group">
    <TimeSlider />
  </media-controls-group>
  <!-- Lower Controls Group -->
  <media-controls-group class="vds-controls-group controls-group">
    <SeekBackButton tooltipPlacement="top start" />
    <PlayButton tooltipPlacement="top" />
    <SeekForwardButton tooltipPlacement="top" />
    <TimeGroup />
    <ChapterTitle />
    <MuteButton tooltipPlacement="top" />
    <VolumeSlider />
    <CaptionButton tooltipPlacement="top" />
    <SettingsMenu placement="top end" tooltipPlacement="top end" />
  </media-controls-group>
</media-controls>

<style>
  .controls {
    border-radius: var(--media-border-radius);
  }

  :global(media-player[data-focus]:not([data-playing])) .controls {
    box-shadow: var(--media-focus-ring);
  }

  .controls :global(media-time-slider) {
    --media-slider-height: 36px;
    --media-slider-preview-offset: 8px;
  }

  .controls :global(media-volume-slider) {
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
