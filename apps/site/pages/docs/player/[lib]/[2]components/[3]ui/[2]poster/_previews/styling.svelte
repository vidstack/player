<script>
  import '../_snippets/styling.css';

  import { Media, Video, AspectRatio, Poster, PlayButton, Gesture } from '@vidstack/player/svelte';
</script>

<Media class="w-full max-w-md">
  <AspectRatio ratio="16/9">
    <Video muted poster="https://media-files.vidstack.io/poster.png">
      <video preload="none" src="https://media-files.vidstack.io/360p.mp4">
        <track kind="captions" />
      </video>
    </Video>
  </AspectRatio>

  <Poster alt="Agent 327 blowing flames with a hair dryer." />

  <div class="big-play-button-container">
    <PlayButton class="big-play-button">
      <svg class="play-icon" aria-hidden="true" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
        />
      </svg>
    </PlayButton>
  </div>

  <Gesture action="toggle:paused" type="click" />
</Media>
