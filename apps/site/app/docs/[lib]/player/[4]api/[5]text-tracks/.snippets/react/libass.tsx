import { MediaPlayer } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { LibASSTextRenderer, type MediaPlayerElement } from 'vidstack';

function Player() {
  const player = useRef<MediaPlayerElement>(null);

  useEffect(() => {
    const renderer = new LibASSTextRenderer(() => import('jassub'), {
      workerUrl: '/jassub/jassub-worker.js',
      legacyWorkerUrl: '/jassub/jassub-worker-legacy.js',
    });

    player.current!.textRenderers.add(renderer);
  }, []);

  return <MediaPlayer ref={player}>{/* ... */}</MediaPlayer>;
}
