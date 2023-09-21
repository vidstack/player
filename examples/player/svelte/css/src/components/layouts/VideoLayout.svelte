<script lang="ts">
  import CaptionButton from '../buttons/CaptionButton.svelte';
  import FullscreenButton from '../buttons/FullscreenButton.svelte';
  import MuteButton from '../buttons/MuteButton.svelte';
  import PIPButton from '../buttons/PIPButton.svelte';
  import PlayButton from '../buttons/PlayButton.svelte';
  import Captions from '../Captions.svelte';
  import ChapterTitle from '../ChapterTitle.svelte';
  import Gestures from '../Gestures.svelte';
  import SettingsMenu from '../menus/SettingsMenu.svelte';
  import TimeSlider from '../sliders/TimeSlider.svelte';
  import VolumeSlider from '../sliders/VolumeSlider.svelte';
  import TimeGroup from '../TimeGroup.svelte';
</script>

<Gestures />
<Captions />

<media-controls class="controls">
  <div class="spacer" />
  <media-controls-group class="controls-group">
    <TimeSlider
      thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
    />
  </media-controls-group>
  <media-controls-group class="controls-group">
    <PlayButton tooltipPlacement="top start" />
    <MuteButton tooltipPlacement="top" />
    <VolumeSlider />
    <TimeGroup />
    <ChapterTitle />
    <div class="spacer" />
    <CaptionButton tooltipPlacement="top" />
    <SettingsMenu />
    <PIPButton tooltipPlacement="top" />
    <FullscreenButton tooltipPlacement="top end" />
  </media-controls-group>
</media-controls>

<style lang="postcss">
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

    &[data-visible] {
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

  .controls :global(.media-button) {
    margin-right: 2.5px;
  }

  .controls :global(media-mute-button) {
    margin-left: -2.5px;
    margin-right: -2px !important;
  }

  .controls :global(media-fullscreen-button) {
    margin-right: 0 !important;
  }
</style>
