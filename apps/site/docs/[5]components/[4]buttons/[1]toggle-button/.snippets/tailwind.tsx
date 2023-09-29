import { MediaToggleButton } from '@vidstack/react';
import { ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react/icons';

<MediaToggleButton
  className="group flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Like"
>
  <ThumbsUpIcon className="hidden group-data-[pressed]:block" />
  <ThumbsDownIcon className="group-data-[pressed]:hidden block" />
</MediaToggleButton>;
