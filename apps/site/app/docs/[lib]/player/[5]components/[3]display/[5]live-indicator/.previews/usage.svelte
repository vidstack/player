<script>
  function onCanPlay(e) {
    e.target.volume = 0.2;
  }
</script>

<media-player
  class="w-full max-w-md relative"
  src="https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8"
  playsinline={true}
  autoplay={true}
  muted={true}
  aspect-ratio="16/9"
  stream-type="ll-live"
  crossorigin=""
  on:can-play={onCanPlay}
>
  <media-outlet>
    <media-buffering-indicator />
  </media-outlet>
  <div class="w-full text-center flex items-center px-1 absolute bottom-0 left-0">
    <media-play-button class="min-w-[40px] min-h-[40px]" />
    <media-time-slider class="w-auto flex-1" />
    <media-live-indicator class="ml-2 mr-2" />
  </div>
</media-player>
