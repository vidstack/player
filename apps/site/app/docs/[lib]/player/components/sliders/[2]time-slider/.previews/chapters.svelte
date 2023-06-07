<script>
  function onCanPlay(e) {
    setTimeout(() => {
      e.target.setAttribute('data-bp-x', 'md');
    }, 1000);
  }
</script>

<media-player
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
  class="w-full max-w-[380px] relative bg-[unset]"
  on:can-play={onCanPlay}
>
  <media-outlet>
    <track
      src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
      srclang="en-US"
      kind="chapters"
      default
    />
  </media-outlet>
  <div class="w-full text-center flex">
    <media-time-slider>
      <div slot="preview">
        <media-slider-thumbnail class="rounded-sm" />
        <div class="absolute bottom-1 w-full text-center text-sm" part="chapter-title" />
      </div>
    </media-time-slider>
  </div>
</media-player>
