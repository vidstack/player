<media-player
  src="https://media-files.vidstack.io/audio.mp3"
  class="w-full max-w-md relative mt-20"
  thumbnails="https://media-files.vidstack.io/thumbnails.vtt"
>
  <media-outlet />
  <media-time-slider>
    <div slot="preview">
      <media-slider-thumbnail class="border-white border" />
      <media-slider-value type="pointer" format="time" />
    </div>
  </media-time-slider>
</media-player>
