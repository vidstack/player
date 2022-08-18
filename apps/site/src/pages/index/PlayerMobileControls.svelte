<script>
  import { PlayButton, MuteButton, Time, FullscreenButton } from '@vidstack/player-svelte';
  import PlayIcon from './icons/PlayIcon.svelte';
  import PauseIcon from './icons/PauseIcon.svelte';
  import MuteIcon from './icons/MuteIcon.svelte';
  import UnmuteIcon from './icons/UnmuteIcon.svelte';
  import EnterFullscreenIcon from './icons/EnterFullscreenIcon.svelte';
  import ExitFullscreenIcon from './icons/ExitFullscreenIcon.svelte';
</script>

<div class="768:hidden relative flex h-full w-full flex-col items-center px-3">
  <div class="pointer-events-auto mt-1 flex w-full flex-row">
    <div class="flex-1" />
    <MuteButton class="media-control">
      <MuteIcon class="media-icon mute-icon" />
      <UnmuteIcon class="media-icon unmute-icon" />
    </MuteButton>
    <FullscreenButton class="media-control -mr-2">
      <EnterFullscreenIcon class="media-icon expand-icon" />
      <ExitFullscreenIcon class="media-icon collapse-icon" />
    </FullscreenButton>
  </div>

  <div class="flex-1" />

  <div class="flex w-full translate-y-3.5 transform items-center justify-center font-bold">
    <PlayButton
      class="media-control pointer-events-auto"
      style="transform: scale(2.5); display: inline-block;"
    >
      <PlayIcon class="media-icon play-icon" />
      <PauseIcon class="media-icon pause-icon" />
    </PlayButton>
  </div>

  <div class="flex-1" />

  <div class="flex w-full translate-y-[18px] transform flex-row items-center">
    <div class="flex-1" />
    <div
      class="flex items-center justify-between rounded-sm bg-[#161616] px-1.5 py-[2px] text-xs"
      style="letter-spacing: 1px;"
    >
      <Time type="current" remainder />
    </div>
  </div>
</div>
