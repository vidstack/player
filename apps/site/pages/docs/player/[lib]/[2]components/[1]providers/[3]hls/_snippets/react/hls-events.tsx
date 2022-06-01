import { type HlsManifestLoadedEvent } from '@vidstack/player';
import { Hls } from '@vidstack/player/react';

function MediaPlayer() {
  function onManifestLoaded(event: HlsManifestLoaded) {
    // ...
  }

  return <Hls onHlsManifestLoaded={onManifestLoaded}>{/* ... */}</Hls>;
}
