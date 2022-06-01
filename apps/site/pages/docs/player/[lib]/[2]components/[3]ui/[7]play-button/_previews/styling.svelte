<script>
  import '../_snippets/styling.css';

  import { AspectRatio, Media, PlayButton, Video } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-xs relative">
  <AspectRatio ratio="16/9">
    <Video volume={0.2} poster="https://media-files.vidstack.io/poster-2.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <PlayButton class="absolute bottom-12 left-1">
    <svg class="media-play-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
      />
    </svg>
    <svg class="media-pause-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6 5h2v14H6V5zm10 0h2v14h-2V5z" />
    </svg>
  </PlayButton>

  <svg
    class="animate-bounce text-white mt-4 ml-1"
    aria-hidden="true"
    role="img"
    width="24"
    height="24"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M13 7.828V20h-2V7.828l-5.364 5.364l-1.414-1.414L12 4l7.778 7.778l-1.414 1.414L13 7.828z"
    />
  </svg>
</Media>
