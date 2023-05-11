import { MediaAudioMenuButton, MediaAudioMenuItems, MediaMenu } from '@vidstack/react';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <MediaMenu>
      <MediaAudioMenuButton label="Audio"></MediaAudioMenuButton>
      <MediaAudioMenuItems emptyLabel="Default" />
    </MediaMenu>
  </MediaMenuItems>
</MediaMenu>;
