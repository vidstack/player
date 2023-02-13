import { MediaPlayer } from '@vidstack/react';
import { isHLSProvider, type MediaProviderSetupEvent } from 'vidstack';

function Player() {
  function onProviderSetup(event: MediaProviderSetupEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      provider.video; // `HTMLVideoElement`
    }
  }

  return <MediaPlayer onProviderSetup={onProviderSetup}>{/* ... */}</MediaPlayer>;
}
