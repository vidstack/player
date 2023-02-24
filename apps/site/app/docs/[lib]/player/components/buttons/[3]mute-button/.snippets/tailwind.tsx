import { MediaMuteButton, MuteIcon, VolumeHighIcon, VolumeLowIcon } from '@vidstack/react';

<MediaMuteButton
  className="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Mute"
>
  <MuteIcon className="muted:block hidden" />
  <VolumeLowIcon className="volume-low:block hidden" />
  <VolumeHighIcon className="volume-high:block hidden" />
</MediaMuteButton>;
