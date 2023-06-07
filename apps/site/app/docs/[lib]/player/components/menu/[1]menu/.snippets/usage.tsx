import { MediaMenu, MediaMenuButton, MediaMenuItems } from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';

<MediaMenu>
  <MediaMenuButton aria-label="Settings">
    <SettingsIcon data-rotate />
  </MediaMenuButton>
  <MediaMenuItems>{/* ... */}</MediaMenuItems>
</MediaMenu>;
