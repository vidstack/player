import { Hls } from '@vidstack/player/react';

function MediaPlayer() {
  return <Hls hlsConfig={{ lowLatencyMode: true }}>{/* ... */}</Hls>;
}
