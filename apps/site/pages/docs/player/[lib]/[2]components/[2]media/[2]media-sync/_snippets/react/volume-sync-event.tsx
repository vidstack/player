import { type MediaVolumeSyncEvent } from '@vidstack/player';
import { Media, MediaSync } from '@vidstack/player/react';

function MediaPlayer() {
  function onVolumeSync(event: MediaVolumeSyncEvent) {
    const { muted, volume } = event.detail;
    // ...
  }

  return (
    <Media>
      <MediaSync onMediaVolumeSync={onVolumeSync}>{/* ... */}</MediaSync>
    </Media>
  );
}
