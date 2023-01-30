import { MediaPlayer } from '@vidstack/react';
import type { MediaLoadedMetadataEvent } from 'vidstack';

function Player() {
  function onLoadedMetadata(event: MediaLoadedMetadataEvent) {
    // original media event (`loadedmetadata`) is still available.
    const originalMediaEvent = event.trigger;
  }

  return <MediaPlayer onLoadedMetadata={onLoadedMetadata}>{/* ... */}</MediaPlayer>;
}
