<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.volume = 0.5;
  }
</script>

<media-player class="w-full max-w-xs relative" on:media-player-connect={onConnect}>
  <media-volume-slider>
    <media-slider-value-text type="pointer" format="percent" slot="preview" />
  </media-volume-slider>
</media-player>
