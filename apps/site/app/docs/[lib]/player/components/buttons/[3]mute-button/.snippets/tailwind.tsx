import { MediaMuteButton } from '@vidstack/react';
import { MuteIcon, VolumeHighIcon, VolumeLowIcon } from '@vidstack/react/icons';

<MediaMuteButton
  className="group flex h-12 w-12 items-center justify-center rounded-sm text-white outline-none data-[focus]:ring-4 data-[focus]:ring-blue-400"
  aria-label="Mute"
>
  <MuteIcon className="hidden group-data-[volume=muted]:block" />
  <VolumeLowIcon className="hidden group-data-[volume=low]:block" />
  <VolumeHighIcon className="hidden group-data-[volume=high]:block" />
</MediaMuteButton>;
