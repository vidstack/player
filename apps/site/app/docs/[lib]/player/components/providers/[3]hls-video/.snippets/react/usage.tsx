import { HLSVideo, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media controls poster="https://media-files.vidstack.io/poster.png" view="video">
      <HLSVideo>
        <video preload="none" src="https://media-files.vidstack.io/hls/index.m3u8"></video>
      </HLSVideo>
    </Media>
  );
}
