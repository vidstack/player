import { FullscreenExitIcon, FullscreenIcon, MediaFullscreenButton } from '@vidstack/react';

<MediaFullscreenButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Fullscreen"
>
  <FullscreenIcon className="not-fullscreen:block hidden" />
  <FullscreenExitIcon className="fullscreen:block hidden" />
</MediaFullscreenButton>;
