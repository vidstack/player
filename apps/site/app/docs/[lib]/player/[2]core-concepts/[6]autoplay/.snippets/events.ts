import { type MediaAutoplayEvent, type MediaAutoplayFailEvent } from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('autoplay', (event: MediaAutoplayEvent) => {
  // autoplay has successfully started.
  const requestEvent = event.request;
});

player.addEventListener('autoplay-fail', (event: MediaAutoplayFailEvent) => {
  // autoplay has failed.
  const requestEvent = event.request;
  console.log(event.detail.muted); // was media muted?
  console.log(event.detail.error); // media error
});
