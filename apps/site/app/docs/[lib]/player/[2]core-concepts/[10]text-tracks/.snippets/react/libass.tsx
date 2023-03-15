import { MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { LibASSTextRenderer, type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    const renderer = new LibASSTextRenderer(() => import('libass-wasm'), {
      workerUrl: '/libass/subtitles-octopus-worker.js',
      legacyWorkerUrl: '/libass/subtitles-octopus-worker-legacy.js',
    });

    player.current!.textRenderers.add(renderer);
  }, []);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
