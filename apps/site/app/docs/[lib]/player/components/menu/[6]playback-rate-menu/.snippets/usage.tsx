import {
  MediaMenu,
  MediaPlaybackRateMenuButton,
  MediaPlaybackRateMenuItems,
} from '@vidstack/react';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <MediaMenu>
      <MediaPlaybackRateMenuButton label="Speed"></MediaPlaybackRateMenuButton>
      <MediaPlaybackRateMenuItems
        rates={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}
        normalLabel="Normal"
      />
    </MediaMenu>
  </MediaMenuItems>
</MediaMenu>;
