import { MediaMenu, MediaQualityMenuButton, MediaQualityMenuItems } from '@vidstack/react';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <MediaMenu>
      <MediaQualityMenuButton label="Quality"></MediaQualityMenuButton>
      <MediaQualityMenuItems autoLabel="Auto" />
    </MediaMenu>
  </MediaMenuItems>
</MediaMenu>;
