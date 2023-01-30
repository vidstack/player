import { MediaPlayer } from '@vidstack/react';
import { isHLSProvider, type MediaProviderChangeEvent } from 'vidstack';

function Player() {
  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      // Default development URL.
      provider.library = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.js';
      // Default production URL.
      provider.library = 'https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js';
    }
  }

  return <MediaPlayer onProviderChange={onProviderChange}>{/* ... */}</MediaPlayer>;
}
