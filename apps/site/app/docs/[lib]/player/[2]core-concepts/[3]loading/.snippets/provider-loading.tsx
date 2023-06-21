import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  isHLSProvider,
  type MediaProviderChangeEvent,
  type MediaProviderSetupEvent,
} from 'vidstack';

function Player() {
  // This is where you should configure providers.
  function onProviderChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    if (isHLSProvider(provider)) {
      provider.config = {};
      provider.onInstance((hls) => {
        // ...
      });
    }
  }

  // Provider is rendered, attached event listeners, and ready to load source.
  function onProviderSetup(event: MediaProviderSetupEvent) {
    const provider = event.detail;
  }

  return (
    <MediaPlayer onProviderChange={onProviderChange} onProviderSetup={onProviderSetup}>
      <MediaProvider />
    </MediaPlayer>
  );
}
