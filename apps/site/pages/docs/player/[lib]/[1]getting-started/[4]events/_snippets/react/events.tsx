import { type MediaLoadedMetadataEvent } from '@vidstack/player';
import { Media, Video } from '@vidstack/player-react';

function MediaPlayer() {
  function onLoadedMetadata(event: MediaLoadedMetadataEvent) {
    // original media event (`loadedmetadata`) is still available.
    const originalMediaEvent = event.trigger;

    // event detail contains goodies.
    const { currentSrc, duration, poster, mediaType } = event.detail;
  }

  return (
    <Media>
      <Video onVdsLoadedMetadata={onLoadedMetadata}>{/* ... */}</Video>
    </Media>
  );
}
