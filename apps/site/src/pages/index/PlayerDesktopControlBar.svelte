<script>
  import {
    PlayButton,
    MuteButton,
    Time,
    FullscreenButton,
    VolumeSlider,
  } from '@vidstack/player-svelte';
  import PlayIcon from './icons/PlayIcon.svelte';
  import PauseIcon from './icons/PauseIcon.svelte';
  import MuteIcon from './icons/MuteIcon.svelte';
  import UnmuteIcon from './icons/UnmuteIcon.svelte';
  import EnterFullscreenIcon from './icons/EnterFullscreenIcon.svelte';
  import ExitFullscreenIcon from './icons/ExitFullscreenIcon.svelte';
</script>

<div
  class="768:flex pointer-events-auto relative hidden min-h-[48px] w-full items-center px-1 pb-1.5"
>
  <PlayButton class="media-control">
    <PlayIcon class="media-icon play-icon" />
    <PauseIcon class="media-icon pause-icon" />
  </PlayButton>
  <div
    class="group relative -ml-0.5 flex w-10 items-center transition-all duration-150 ease-in hover:w-[140px]"
  >
    <MuteButton class="media-control ">
      <MuteIcon class="media-icon mute-icon" />
      <UnmuteIcon class="media-icon unmute-icon" />
    </MuteButton>
    <VolumeSlider
      class="media-slider media-volume-slider relative flex h-[48px] w-[100px] cursor-pointer items-center"
    >
      <div class="media-slider-track" />
      <div class="media-slider-track fill" />
      <div class="media-slider-thumb-container">
        <div class="media-slider-thumb" />
      </div>
    </VolumeSlider>
  </div>
  <div class="ml-2 flex items-center justify-between text-sm" style="letter-spacing: 0.5px;">
    <Time type="current" />
    <span class="mx-0.5">/</span>
    <Time type="duration" />
  </div>
  <div class="pointer-events-none flex-1" />
  <FullscreenButton class="media-control mr-1">
    <EnterFullscreenIcon class="media-icon expand-icon" />
    <ExitFullscreenIcon class="media-icon collapse-icon" />
  </FullscreenButton>
</div>
