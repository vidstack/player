<script>
  function onConnect(event) {
    const player = event.target;
    player.$store.duration = 231;
  }
</script>

<media-player class="w-full max-w-md relative mt-20" on:media-player-connect={onConnect}>
  <media-time-slider>
    <div slot="preview">
      <media-slider-video src="https://media-files.vidstack.io/240p.mp4" />
      <media-slider-value-text type="pointer" format="time" />
    </div>
  </media-time-slider>
</media-player>
