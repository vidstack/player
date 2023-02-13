import { type MediaPlayerConnectEvent } from 'vidstack';

playerContainer.addEventListener('media-player-connect', (event: MediaPlayerConnectEvent) => {
  const player = event.detail; // <media-player>
  // ...
});
