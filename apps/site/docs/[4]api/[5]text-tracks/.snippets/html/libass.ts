import { LibASSTextRenderer } from 'vidstack';

const player = document.querySelector('media-player');

player.onAttach(() => {
  const renderer = new LibASSTextRenderer(() => import('jassub'), {
    workerUrl: '/jassub/jassub-worker.js',
    legacyWorkerUrl: '/jassub/jassub-worker-legacy.js',
  });

  player.textRenderers.add(renderer);
});
