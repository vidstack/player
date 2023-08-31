import {
  MediaAudioMenuButton,
  MediaAudioMenuItems,
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
      <MediaAudioMenuButton label="Audio"></MediaAudioMenuButton>
      <MediaAudioMenuItems emptyLabel="Default" />
    </MediaMenu>
  </MediaMenuItems>
</MediaMenu>;
