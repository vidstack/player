<script>
  import { Media, Hls, AspectRatio } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Hls controls poster="https://media-files.vidstack.io/poster.png">
      <video controls preload="none" src="https://media-files.vidstack.io/hls/index.m3u8">
        <track kind="captions" />
      </video>
    </Hls>
  </AspectRatio>
</Media>
