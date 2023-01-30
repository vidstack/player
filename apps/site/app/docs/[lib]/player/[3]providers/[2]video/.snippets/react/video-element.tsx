import { MediaPlayer } from '@vidstack/react';
import { isVideoProvider, type MediaProviderSetupEvent } from 'vidstack';

function Player() {
  function onProviderSetup(event: MediaProviderSetupEvent) {
    const provider = event.detail;
    if (isVideoProvider(provider)) {
      provider.video; // `HTMLVideoElement`
    }
  }

  return <MediaPlayer onProviderSetup={onProviderSetup}>{/* ... */}</MediaPlayer>;
}
