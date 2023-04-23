<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration.set(231);
  }
</script>

<media-player class="w-full max-w-md relative mt-20" on:media-player-connect={onConnect}>
  <media-outlet />
  <media-time-slider>
    <media-slider-video src="https://media-files.vidstack.io/240p.mp4" slot="preview" />
  </media-time-slider>
</media-player>
