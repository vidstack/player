import { MediaRadio, MediaRadioGroup } from '@vidstack/react';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <MediaRadioGroup value="720">
      <MediaRadio value="1080">1080p</MediaRadio>
      <MediaRadio value="720">720p</MediaRadio>
      <MediaRadio value="480">480p</MediaRadio>
    </MediaRadioGroup>
  </MediaMenuItems>
</MediaMenu>;
