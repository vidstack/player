import { type MediaAutoplayEvent, type MediaAutoplayFailEvent } from 'vidstack';

const provider = document.querySelector('vds-video');

provider.addEventListener('autoplay', (event: MediaAutoplayEvent) => {
  // autoplay has successfully started.
});

provider.addEventListener('autoplay-fail', (event: MediaAutoplayFailEvent) => {
  // autoplay has failed.
  console.log(event.detail.muted); // was media muted?
  console.log(event.detail.error); // media error
});
