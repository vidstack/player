import { ClosedCaptionsIcon, ClosedCaptionsOnIcon, MediaCaptionButton } from '@vidstack/react';

<MediaCaptionButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Closed-Captions"
>
  <ClosedCaptionsIcon className="not-captions:block hidden" />
  <ClosedCaptionsOnIcon className="captions:block hidden" />
</MediaCaptionButton>;
