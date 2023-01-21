import { HLSVideo, Media } from '@vidstack/react';
import HLS from 'hls.js';

function MediaPlayer() {
  return (
    <Media>
      <HLSVideo hlsLibrary={HLS}>{/* ... */}</HLSVideo>
    </Media>
  );
}
