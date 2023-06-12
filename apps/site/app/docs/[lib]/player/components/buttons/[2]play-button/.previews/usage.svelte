<media-player
  class="w-full max-w-xs relative bg-[unset]"
  volume={0.2}
  playsinline
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  aspect-ratio="16/9"
>
  <media-outlet>
    <media-poster alt="Agent 327 blowing flames with a hair dryer." />
  </media-outlet>

  <div class="w-full p-1 absolute bottom-0 left-0 bg-black/20 flex items-center justify-center">
    <media-play-button />
  </div>
</media-player>
