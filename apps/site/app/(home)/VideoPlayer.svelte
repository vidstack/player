<media-player
  title="Sprite Fight"
  class="hero-video overflow-hidden shadow-lg"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  poster="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/animated.webp?start=268&end=278&width=640"
  thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
  aspect-ratio="16/9"
  key-target="document"
  crossorigin=""
  volume={0.2}
  style="--video-brand: rgb(124 58 237);"
>
  <media-outlet>
    <media-poster alt="Girl walks into sprite gnomes around her friend on a campfire in danger!" />
    <track src="/media/sprite-fight.vtt" label="English" srclang="en-US" kind="subtitles" default />
    <track
      src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
      srclang="en-US"
      kind="chapters"
      default
    />
  </media-outlet>
  <media-community-skin />
</media-player>

<style>
  media-player:not([data-fullscreen]) {
    aspect-ratio: 16 / 9;
    border-radius: 2px;
    border: 1px solid rgb(255 255 255 / 0.1);
  }
</style>
