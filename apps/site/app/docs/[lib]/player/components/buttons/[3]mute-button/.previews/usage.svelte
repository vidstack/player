<script>
  function onAttach(event) {
    event.target.volume = 0.2;
  }
</script>

<media-player
  class="w-full max-w-xs relative"
  src="https://media-files.vidstack.io/360p.mp4"
  poster="https://media-files.vidstack.io/poster-2.png"
  playsinline
  aspect-ratio="16/9"
  on:attached={onAttach}
>
  <media-outlet>
    <media-poster alt="Agent 327 blowing flames with a hair dryer." />
  </media-outlet>

  <div class="w-full flex items-center">
    <media-play-button />
    <media-mute-button />
    <media-volume-slider />
  </div>
</media-player>
