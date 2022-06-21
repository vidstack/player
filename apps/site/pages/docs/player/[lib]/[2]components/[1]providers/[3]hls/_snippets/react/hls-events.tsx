import { type HlsManifestLoadedEvent } from '@vidstack/player';
import { Hls } from '@vidstack/player-react';

function MediaPlayer() {
  function onManifestLoaded(event: HlsManifestLoadedEvent) {
    // ...
  }

  return <Hls onVdsHlsManifestLoaded={onManifestLoaded}>{/* ... */}</Hls>;
}
