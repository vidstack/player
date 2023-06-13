import { MediaFullscreenButton } from '@vidstack/react';
import { FullscreenExitIcon, FullscreenIcon } from '@vidstack/react/icons';

<MediaFullscreenButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Fullscreen"
>
  <FullscreenIcon className="not-fullscreen:block hidden" />
  <FullscreenExitIcon className="fullscreen:block hidden" />
</MediaFullscreenButton>;
