<script>
  import { Media, Video, AspectRatio } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Video controls poster="https://media-files.vidstack.io/poster.png">
      <video preload="none" src="https://media-files.vidstack.io/720p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>
</Media>
