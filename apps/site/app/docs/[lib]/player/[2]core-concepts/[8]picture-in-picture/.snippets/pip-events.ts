import { type MediaPIPChangeEvent, type MediaPIPErrorEvent } from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('picture-in-picture-change', (event: MediaPIPChangeEvent) => {
  const requestEvent = event.request;
  const isActive = event.detail;
});

player.addEventListener('picture-in-picture-error', (event: MediaPIPErrorEvent) => {
  const requestEvent = event.request;
  const error = event.detail;
});
