<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration = 231;
    player.setAttribute('data-can-play', '');
  }
</script>

<media-player class="w-full max-w-md relative mt-20" on:media-player-connect={onConnect}>
  <media-time-slider>
    <div slot="preview">
      <media-slider-thumbnail src="https://media-files.vidstack.io/thumbnails.vtt" />
      <media-slider-value type="pointer" format="time" />
    </div>
  </media-time-slider>
</media-player>
