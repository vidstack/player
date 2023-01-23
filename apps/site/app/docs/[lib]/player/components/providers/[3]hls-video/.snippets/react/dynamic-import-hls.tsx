import { HLSVideo, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <HLSVideo library={() => import('hls.js')}>{/* ... */}</HLSVideo>
    </Media>
  );
}
