import { HLSVideo } from '@vidstack/react';

function MediaPlayer() {
  return <HLSVideo hlsConfig={{ lowLatencyMode: true }}>{/* ... */}</HLSVideo>;
}
