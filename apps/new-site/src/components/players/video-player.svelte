<script>
  // Styles
  import 'vidstack/player/styles/default/theme.css';
  import 'vidstack/player/styles/default/layouts/audio.css';
  import 'vidstack/player/styles/default/layouts/video.css';
  // Elements
  import 'vidstack/player';
  import 'vidstack/player/layouts';
  import 'vidstack/player/ui';
</script>

<media-player
  title="Sprite Fight"
  src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8"
  class="aspect-video w-full min-w-[275px] max-w-[80%] @sm:max-w-[90%] border-0"
  playsinline
  crossorigin
  style="aspect-ratio: 16/9;"
>
  <media-provider class="block">
    <media-poster
      src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=640"
      class="vds-poster"
      alt="Girl walks into sprite gnomes around her friend on a campfire in danger!"
    ></media-poster>
    <track
      src="https://media-files.vidstack.io/sprite-fight/subs/english.vtt"
      label="English"
      srclang="en-US"
      kind="subtitles"
      default
    />
    <track
      src="https://media-files.vidstack.io/sprite-fight/subs/spanish.vtt"
      label="Spanish"
      srclang="es-ES"
      kind="subtitles"
    />
    <track
      src="https://media-files.vidstack.io/sprite-fight/chapters.vtt"
      srclang="en-US"
      kind="chapters"
      default
    />
  </media-provider>

  <media-video-layout thumbnails="https://media-files.vidstack.io/sprite-fight/thumbnails.vtt"
  ></media-video-layout>
</media-player>
