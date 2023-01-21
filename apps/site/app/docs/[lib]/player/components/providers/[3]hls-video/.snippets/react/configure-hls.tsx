import { HLSVideo, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <HLSVideo hlsConfig={{ lowLatencyMode: true }}>{/* ... */}</HLSVideo>
    </Media>
  );
}
