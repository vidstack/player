import { MediaPlayButton, PauseIcon, PlayIcon } from '@vidstack/react';

<MediaPlayButton
  class="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Play"
>
  <PlayIcon class="paused:block hidden" />
  <PauseIcon class="not-paused:block hidden" />
</MediaPlayButton>;
