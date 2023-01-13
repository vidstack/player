<script>
  import '../.snippets/styling.css';
</script>

<vds-media class="w-full max-w-md">
  <vds-aspect-ratio ratio="16/9">
    <vds-video autoplay muted>
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </vds-video>
  </vds-aspect-ratio>

  <div class="media-controls">
    <vds-time-slider>
      <div class="slider-track" />
      <div class="slider-track fill" />
      <div class="slider-thumb-container">
        <div class="slider-thumb" />
      </div>

      <div class="media-preview-container">
        <vds-slider-video src="https://media-files.vidstack.io/240p.mp4" />
        <vds-slider-value-text type="pointer" format="time" />
      </div>
    </vds-time-slider>
  </div>

  <!-- <vds-gesture class="absolute top-0 left-0 w-full h-full" action="toggle:paused" type="click" /> -->
</vds-media>
