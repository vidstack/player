<script>
  function onConnect(event) {
    const media = event.target;
    media.$store.duration = 231;
  }
</script>

<vds-media class="w-full max-w-xs relative" on:media-connect={onConnect}>
  <vds-time-slider>
    <vds-slider-value-text type="pointer" format="time" slot="preview" />
  </vds-time-slider>
</vds-media>
