import { MediaToggleButton, ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react';

<MediaToggleButton
  class="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Like"
>
  <ThumbsUpIcon class="pressed:block hidden" />
  <ThumbsDownIcon class="not-pressed:block hidden" />
</MediaToggleButton>;
