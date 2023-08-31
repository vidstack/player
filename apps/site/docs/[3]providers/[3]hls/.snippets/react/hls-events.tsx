import { MediaPlayer } from '@vidstack/react';
import { type HLSManifestLoadedEvent } from 'vidstack';

function Player() {
  function onManifestLoaded(event: HLSManifestLoadedEvent) {
    const levelLoadedData = event.detail;
    // ...
  }

  return <MediaPlayer onHlsManifestLoaded={onManifestLoaded}>{/* ... */}</MediaPlayer>;
}
