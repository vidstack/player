<media-player
  class="w-full max-w-xs relative"
  volume={0.2}
  playsinline
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  aspect-ratio="16/9"
>
  <media-outlet>
    <media-poster alt="Agent 327 blowing flames with a hair dryer." />
    <media-gesture
      class="top-0 left-0 h-full w-full z-0"
      event="pointerup"
      action="toggle:paused"
    />
    <media-gesture
      class="top-0 left-0 h-full w-full z-0"
      event="dblpointerup"
      action="toggle:fullscreen"
    />
    <media-gesture class="top-0 left-0 z-10 h-full w-1/5" event="dblpointerup" action="seek:-10" />
    <media-gesture class="top-0 right-0 z-10 h-full w-1/5" event="dblpointerup" action="seek:10" />
  </media-outlet>
</media-player>
