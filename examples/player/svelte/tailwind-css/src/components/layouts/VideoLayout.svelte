<script setup lang="ts">
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

  export let thumbnails: string | undefined = undefined;
</script>

<Gestures />
<Captions />

<media-controls
  class="media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity"
>
  <div class="flex-1" />
  <media-controls-group class="flex w-full items-center px-2">
    <TimeSlider {thumbnails} />
  </media-controls-group>
  <media-controls-group class="-mt-0.5 flex w-full items-center px-2 pb-2">
    <PlayButton tooltipPlacement="top start" />
    <MuteButton tooltipPlacement="top" />
    <VolumeSlider />
    <TimeGroup />
    <ChapterTitle />
    <div class="flex-1" />
    <CaptionButton tooltipPlacement="top" />
    <SettingsMenu placement="top end" tooltipPlacement="top" />
    <PIPButton tooltipPlacement="top" />
    <FullscreenButton tooltipPlacement="top end" />
  </media-controls-group>
</media-controls>

<style scoped>
  media-controls {
    /* These CSS variables are supported out of the box to easily apply offsets to all tooltips/menus.  */
    --media-tooltip-y-offset: 30px;
    --media-menu-y-offset: 30px;
  }

  media-controls :global(media-volume-slider) {
    --media-slider-preview-offset: 30px;
  }
</style>
