import { MediaPlayButton, PauseIcon, PlayIcon } from '@vidstack/react';

<MediaPlayButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Play"
>
  <PlayIcon className="paused:block hidden" />
  <PauseIcon className="not-paused:block hidden" />
</MediaPlayButton>;
