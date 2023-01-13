import { HLSVideo } from '@vidstack/react';

function MediaPlayer() {
  return (
    <HLSVideo controls poster="https://media-files.vidstack.io/poster.png">
      <video controls preload="none" src="https://media-files.vidstack.io/hls/index.m3u8"></video>
    </HLSVideo>
  );
}
