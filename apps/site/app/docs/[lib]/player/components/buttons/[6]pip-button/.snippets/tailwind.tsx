import { MediaPIPButton, PictureInPictureExitIcon, PictureInPictureIcon } from '@vidstack/react';

<MediaPIPButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Picture In Picture"
>
  <PictureInPictureIcon className="not-pip:block hidden" />
  <PictureInPictureExitIcon className="pip:block hidden" />
</MediaPIPButton>;
