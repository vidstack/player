import { type MediaFullscreenChangeEvent, type MediaFullscreenErrorEvent } from 'vidstack';

const media = document.querySelector('vds-media');

media.addEventListener('fullscreen-change', (event: MediaFullscreenChangeEvent) => {
  const requestEvent = event.request;
  const isFullscreen = event.detail;
});

media.addEventListener('fullscreen-error', (event: MediaFullscreenErrorEvent) => {
  const requestEvent = event.request;
  const error = event.detail;
});
