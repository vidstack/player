import { Hls } from '@vidstack/player/react';

function MediaPlayer() {
  return <Hls hlsLibrary={() => import('hls.js')}>{/* ... */}</Hls>;
}
