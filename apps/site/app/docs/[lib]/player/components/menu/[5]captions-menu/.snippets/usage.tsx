import {
  MediaCaptionsMenuButton,
  MediaCaptionsMenuItems,
  MediaMenu,
  MediaMenuButton,
  MediaMenuItems,
} from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';

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
