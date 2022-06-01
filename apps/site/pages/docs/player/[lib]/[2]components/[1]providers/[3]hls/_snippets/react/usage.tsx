import { Hls } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Hls controls poster="https://media-files.vidstack.io/poster.png">
      <video controls preload="none" src="https://media-files.vidstack.io/hls/index.m3u8"></video>
    </Hls>
  );
}
