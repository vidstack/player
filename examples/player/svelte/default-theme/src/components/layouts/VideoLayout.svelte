<script lang="ts">
  import CaptionButton from '../buttons/CaptionButton.svelte';
  import FullscreenButton from '../buttons/FullscreenButton.svelte';
  import MuteButton from '../buttons/MuteButton.svelte';
  import PIPButton from '../buttons/PIPButton.svelte';
  import PlayButton from '../buttons/PlayButton.svelte';
  import ChapterTitle from '../ChapterTitle.svelte';
  import SettingsMenu from '../menus/SettingsMenu.svelte';
  import TimeSlider from '../sliders/TimeSlider.svelte';
  import VolumeSlider from '../sliders/VolumeSlider.svelte';
  import TimeGroup from '../TimeGroup.svelte';
  import VideoCaptions from '../VideoCaptions.svelte';
  import VideoGestures from '../VideoGestures.svelte';

  export let thumbnails: string | undefined = undefined;
</script>

<VideoGestures />
<VideoCaptions />

<media-controls class="vds-controls controls">
  <div class="vds-controls-spacer" />
  <media-controls-group class="vds-controls-group controls-group">
    <TimeSlider {thumbnails} />
  </media-controls-group>
  <media-controls-group class="vds-controls-group controls-group">
    <PlayButton tooltipPlacement="top start" />
    <MuteButton tooltipPlacement="top" />
    <VolumeSlider />
    <TimeGroup />
    <ChapterTitle />
    <div class="vds-controls-spacer" />
    <CaptionButton tooltipPlacement="top" />
    <SettingsMenu placement="top end" tooltipPlacement="top" />
    <PIPButton tooltipPlacement="top" />
    <FullscreenButton tooltipPlacement="top end" />
  </media-controls-group>
</media-controls>

<style>
  .controls :global(media-time-slider) {
    --media-slider-height: 40px;
  }

  .controls :global(media-time-slider media-slider-value) {
    background-color: unset;
  }

  .controls :global(media-volume-slider) {
    --media-slider-height: 40px;
    --media-slider-preview-offset: 32px;
    margin-left: 1.5px;
    max-width: 80px;
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
</style>
