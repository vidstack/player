import { HLSVideo } from '@vidstack/react';

function MediaPlayer() {
  return <HLSVideo hlsLibrary={() => import('hls.js')}>{/* ... */}</HLSVideo>;
}
