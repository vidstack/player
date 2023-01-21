<script>
  function onConnect(event) {
    const media = event.target;
    media.$store.duration = 231;
  }
</script>

<vds-media class="w-full max-w-md relative mt-20" on:media-connect={onConnect} view="video">
  <vds-time-slider>
    <vds-slider-video src="https://media-files.vidstack.io/240p.mp4" slot="preview" />
  </vds-time-slider>
</vds-media>
