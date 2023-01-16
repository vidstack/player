<script>
  function onConnect(event) {
    const media = event.target;
    media.$store.volume = 0.5;
  }
</script>

<vds-media class="w-full max-w-xs relative" on:media-connect={onConnect}>
  <vds-volume-slider>
    <vds-slider-value-text type="pointer" format="percent" slot="preview" />
  </vds-volume-slider>
</vds-media>
