import { MediaSeekButton } from '@vidstack/react';
import { SeekForwardIcon } from '@vidstack/react/icons';

<MediaSeekButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  seconds={30}
  aria-label="Seek forward 30 seconds"
>
  <SeekForwardIcon />
</MediaSeekButton>;
