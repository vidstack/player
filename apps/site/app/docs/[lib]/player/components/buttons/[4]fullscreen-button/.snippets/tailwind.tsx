import { FullscreenExitIcon, FullscreenIcon, MediaFullscreenButton } from '@vidstack/react';

<MediaFullscreenButton
  class="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Fullscreen"
>
  <FullscreenIcon class="not-fullscreen:block hidden" />
  <FullscreenExitIcon class="fullscreen:block hidden" />
</MediaFullscreenButton>;
