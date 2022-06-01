<script>
  import '../_snippets/styling.css';

  import { AspectRatio, Media, FullscreenButton, Video, Gesture } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-xs relative">
  <AspectRatio ratio="16/9">
    <Video autoplay muted volume={0.2} poster="https://media-files.vidstack.io/poster-2.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <FullscreenButton class="absolute bottom-12 right-2">
    <svg class="media-enter-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"
      />
    </svg>
    <svg class="media-exit-fs-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
      />
    </svg>
  </FullscreenButton>

  <Gesture class="absolute inset-0 w-full h-full" type="click" action="toggle:paused" />

  <svg
    class="animate-bounce text-white mt-4 mr-1 ml-auto"
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
