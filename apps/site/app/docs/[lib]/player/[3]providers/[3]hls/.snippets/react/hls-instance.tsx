import { MediaPlayer } from '@vidstack/react';
import { isHLSProvider, type MediaProviderSetupEvent } from 'vidstack';

function Player() {
  function onProviderSetup(event: MediaProviderSetupEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      provider.ctor; // `hls.js` constructor
      provider.instance; // `hls.js` instance
    }
  }

  return <MediaPlayer onProviderSetup={onProviderSetup}>{/* ... */}</MediaPlayer>;
}
