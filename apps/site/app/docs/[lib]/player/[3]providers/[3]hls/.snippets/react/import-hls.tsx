import { MediaPlayer } from '@vidstack/react';
import HLS from 'hls.js';
import { isHLSProvider, type MediaProviderChangeEvent } from 'vidstack';

function Player() {
  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      // Static import
      provider.library = HLS;
      // Or, dynamic import
      provider.library = () => import('hls.js');
    }
  }

  return <MediaPlayer onProviderChange={onProviderChange}>{/* ... */}</MediaPlayer>;
}
