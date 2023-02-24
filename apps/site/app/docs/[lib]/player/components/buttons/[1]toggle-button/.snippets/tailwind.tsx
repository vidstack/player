import { MediaToggleButton, ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react';

<MediaToggleButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Like"
>
  <ThumbsUpIcon className="pressed:block hidden" />
  <ThumbsDownIcon className="not-pressed:block hidden" />
</MediaToggleButton>;
