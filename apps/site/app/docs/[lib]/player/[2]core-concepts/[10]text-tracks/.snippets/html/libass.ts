import { LibASSTextRenderer } from 'vidstack';

const player = document.querySelector('media-player');

player.onAttach(() => {
  const renderer = new LibASSTextRenderer(() => import('libass-wasm'), {
    workerUrl: '/libass/subtitles-octopus-worker.js',
    legacyWorkerUrl: '/libass/subtitles-octopus-worker-legacy.js',
  });

  player.textRenderers.add(renderer);
});
