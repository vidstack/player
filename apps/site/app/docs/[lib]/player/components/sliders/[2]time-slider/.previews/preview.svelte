<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration.set(231);
    player.setAttribute('data-can-play', '');
  }
</script>

<media-player class="w-full max-w-xs relative" on:media-player-connect={onConnect}>
  <media-time-slider>
    <media-slider-value type="pointer" format="time" slot="preview" />
  </media-time-slider>
</media-player>
