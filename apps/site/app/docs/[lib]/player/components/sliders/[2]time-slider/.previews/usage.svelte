<media-player
  class="w-full max-w-xs relative bg-[unset]"
  volume={0.2}
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  playsinline
  aspect-ratio="16/9"
>
  <media-outlet>
    <media-poster />
  </media-outlet>
  <div class="w-full flex items-center px-1 absolute bottom-0 left-0 bg-black/20">
    <media-play-button class="min-w-[40px]" />
    <media-time-slider />
  </div>
</media-player>
