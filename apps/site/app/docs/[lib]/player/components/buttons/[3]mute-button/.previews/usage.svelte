<script>
  function onAttach(event) {
    event.target.volume = 0.2;
  }
</script>

<media-player
  class="w-full max-w-xs relative bg-[unset]"
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  playsinline
  aspect-ratio="16/9"
  on:attached={onAttach}
>
  <media-outlet>
    <media-poster alt="Agent 327 blowing flames with a hair dryer." />
  </media-outlet>

  <div class="w-full flex items-center absolute bottom-0 left-0 bg-black/20 px-1">
    <media-play-button class="min-w-[40px]" />
    <media-mute-button class="min-w-[40px]" />
    <media-volume-slider />
  </div>
</media-player>
