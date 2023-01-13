import { HLSVideo } from '@vidstack/react';
import type { HLSManifestLoadedEvent } from 'vidstack';

function MediaPlayer() {
  function onManifestLoaded(event: HLSManifestLoadedEvent) {
    // ...
  }

  return <HLSVideo onHlsManifestLoaded={onManifestLoaded}>{/* ... */}</HLSVideo>;
}
