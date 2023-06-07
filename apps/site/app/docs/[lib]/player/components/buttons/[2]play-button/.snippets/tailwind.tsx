import { MediaPlayButton } from '@vidstack/react';
import { PauseIcon, PlayIcon, ReplayIcon } from '@vidstack/react/icons';

<MediaPlayButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Play"
>
  <PlayIcon className="paused:block ended:hidden hidden" />
  <PauseIcon className="not-paused:block hidden" />
  <ReplayIcon className="ended:block hidden" />
</MediaPlayButton>;
