import { MediaCaptionsMenuButton, MediaCaptionsMenuItems, MediaMenu } from '@vidstack/react';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>
    <MediaMenu>
      <MediaCaptionsMenuButton label="Captions"></MediaCaptionsMenuButton>
      <MediaCaptionsMenuItems offLabel="Off" />
    </MediaMenu>
  </MediaMenuItems>
</MediaMenu>;
