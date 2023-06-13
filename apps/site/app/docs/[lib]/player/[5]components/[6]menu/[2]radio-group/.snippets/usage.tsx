import {
  MediaMenu,
  MediaMenuButton,
  MediaMenuItems,
  MediaRadio,
  MediaRadioGroup,
} from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';

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
