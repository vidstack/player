import { Hls } from '@vidstack/react';

function MediaPlayer() {
  return <Hls hlsConfig={{ lowLatencyMode: true }}>{/* ... */}</Hls>;
}
