<media-player
  class="w-full max-w-xs relative"
  volume={0.2}
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  playsinline
  aspect-ratio="16/9"
>
  <media-outlet>
    <media-poster alt="Agent 327 blowing flames with a hair dryer." />
  </media-outlet>
  <div class="absolute bottom-0 left-0 flex w-full px-2 py-2">
    <media-play-button />
    <div class="flex-1" />
    <media-pip-button />
  </div>
</media-player>
