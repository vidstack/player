import { MediaToggleButton, MediaTooltip } from '@vidstack/react';
import { ThumbsDownIcon, ThumbsUpIcon } from '@vidstack/react/icons';

<MediaToggleButton className="group flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400">
  {/* icons */}
  <ThumbsUpIcon className="hidden group-data-[pressed]:block" />
  <ThumbsDownIcon className="block group-data-[pressed]:hidden" />
  {/* tooltip */}
  <MediaTooltip
    className="ease pointer-events-none absolute bottom-full left-1/2 mb-4 -translate-x-1/2 translate-y-2.5 scale-75 whitespace-nowrap rounded-sm bg-black py-1 px-2 font-sans text-xs text-white opacity-0 transition-all duration-200 group-data-[hocus]:-translate-x-1/2 group-data-[hocus]:scale-100 group-data-[hocus]:opacity-100"
    style={{ transformOrigin: '50% 100%' }}
  >
    <span className="hidden group-data-[pressed]:inline">Pressed</span>
    <span className="inline group-data-[pressed]:hidden">Not Pressed</span>
  </MediaTooltip>
</MediaToggleButton>;
