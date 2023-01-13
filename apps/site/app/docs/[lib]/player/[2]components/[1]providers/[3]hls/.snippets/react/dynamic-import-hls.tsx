import { Hls } from '@vidstack/react';

function MediaPlayer() {
  return <Hls hlsLibrary={() => import('hls.js')}>{/* ... */}</Hls>;
}
