import {
  MediaMenu,
  MediaMenuButton,
  MediaMenuItems,
  MediaQualityMenuButton,
  MediaQualityMenuItems,
} from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';

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
