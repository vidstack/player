<script>
  import '../_snippets/styling.css';

  import { AspectRatio, Media, MuteButton, Video, Gesture } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-xs relative">
  <AspectRatio ratio="16/9">
    <Video autoplay muted volume={0.2} poster="https://media-files.vidstack.io/poster-2.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <MuteButton class="absolute bottom-12 left-1.5">
    <svg class="media-mute-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536l-1.414 1.414L19 13.414l-3.536 3.536l-1.414-1.414L17.586 12L14.05 8.464l1.414-1.414L19 10.586l3.536-3.536l1.414 1.414L20.414 12z"
      />
    </svg>
    <svg class="media-unmute-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"
      />
    </svg>
  </MuteButton>

  <Gesture class="absolute inset-0 w-full h-full" type="click" action="toggle:paused" />

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
