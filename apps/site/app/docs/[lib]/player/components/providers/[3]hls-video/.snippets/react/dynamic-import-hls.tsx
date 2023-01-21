import { HLSVideo, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <HLSVideo hlsLibrary={() => import('hls.js')}>{/* ... */}</HLSVideo>
    </Media>
  );
}
