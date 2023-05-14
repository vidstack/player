import { type MediaFullscreenChangeEvent, type MediaFullscreenErrorEvent } from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('fullscreen-change', (event: MediaFullscreenChangeEvent) => {
  const requestEvent = event.request;
  const isFullscreen = event.detail;
});

player.addEventListener('fullscreen-error', (event: MediaFullscreenErrorEvent) => {
  const requestEvent = event.request;
  const error = event.detail;
});
