<script>
  function onConnect(event) {
    const media = event.target;
    media.$store.duration = 231;
  }
</script>

<vds-media class="w-full max-w-md relative mt-20" on:media-connect={onConnect}>
  <vds-time-slider>
    <div slot="preview">
      <vds-slider-video src="https://media-files.vidstack.io/240p.mp4" />
      <vds-slider-value-text type="pointer" format="time" />
    </div>
  </vds-time-slider>
</vds-media>
