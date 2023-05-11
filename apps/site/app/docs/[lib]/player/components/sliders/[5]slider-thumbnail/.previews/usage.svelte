<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration.set(231);
  }
</script>

<media-player
  class="w-full max-w-md relative mt-20"
  thumbnails="https://media-files.vidstack.io/thumbnails.vtt"
  on:media-player-connect={onConnect}
>
  <media-outlet />
  <media-time-slider>
    <media-slider-thumbnail slot="preview" />
  </media-time-slider>
</media-player>
