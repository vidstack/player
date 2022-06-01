<script>
  import '../_snippets/usage.css';

  import { Media, Video, AspectRatio, Poster } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Video poster="https://media-files.vidstack.io/poster.png" />
  </AspectRatio>

  <Poster alt="Agent 327 blowing flames with a hair dryer." />
</Media>
