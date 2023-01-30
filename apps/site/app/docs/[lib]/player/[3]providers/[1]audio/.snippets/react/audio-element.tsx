import { MediaPlayer } from '@vidstack/react';
import { isAudioProvider, type MediaProviderSetupEvent } from 'vidstack';

function Player() {
  function onProviderSetup(event: MediaProviderSetupEvent) {
    const provider = event.detail;
    if (isAudioProvider(provider)) {
      provider.audio; // `HTMLAudioElement`
    }
  }

  return <MediaPlayer onProviderSetup={onProviderSetup}>{/* ... */}</MediaPlayer>;
}
