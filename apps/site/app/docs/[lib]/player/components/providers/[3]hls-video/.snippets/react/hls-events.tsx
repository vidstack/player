import { HLSVideo, Media } from '@vidstack/react';
import type { HLSManifestLoadedEvent } from 'vidstack';

function MediaPlayer() {
  function onManifestLoaded(event: HLSManifestLoadedEvent) {
    // ...
  }

  return (
    <Media>
      <HLSVideo onManifestLoaded={onManifestLoaded}>{/* ... */}</HLSVideo>
    </Media>
  );
}
