import { MediaPlayer } from '@vidstack/react';
import { isHLSProvider, type MediaProviderChangeEvent } from 'vidstack';

function Player() {
  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      provider.onInstance((hls) => {
        // ...
      });
    }
  }

  return <MediaPlayer onProviderChange={onProviderChange}>{/* ... */}</MediaPlayer>;
}
