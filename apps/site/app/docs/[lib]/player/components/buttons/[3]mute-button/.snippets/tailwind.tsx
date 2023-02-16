import { MediaMuteButton, MuteIcon, VolumeHighIcon, VolumeLowIcon } from '@vidstack/react';

<MediaMuteButton
  class="flex h-12 w-12 items-center justify-center rounded-sm text-white"
  aria-label="Mute"
>
  <MuteIcon class="muted:block hidden" />
  <VolumeLowIcon class="volume-low:block hidden" />
  <VolumeHighIcon class="volume-high:block hidden" />
</MediaMuteButton>;
