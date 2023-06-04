<media-player
  src="https://media-files.vidstack.io/audio.mp3"
  class="w-full max-w-xs relative"
  volume={0.5}
>
  <media-outlet />
  <media-volume-slider>
    <media-slider-value type="pointer" format="percent" slot="preview" />
  </media-volume-slider>
</media-player>
