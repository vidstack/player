import { HLSVideo } from '@vidstack/react';
import HLS from 'hls.js';

function MediaPlayer() {
  return <HLSVideo hlsLibrary={HLS}>{/* ... */}</HLSVideo>;
}
