import { MediaPlayButton, PauseIcon, PlayIcon } from '@vidstack/react';

<MediaPlayButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Play"
>
  <PlayIcon className="paused:block hidden" />
  <PauseIcon className="not-paused:block hidden" />
</MediaPlayButton>;
