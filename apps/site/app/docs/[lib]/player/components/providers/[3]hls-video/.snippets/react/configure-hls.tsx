import { HLSVideo, Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <HLSVideo config={{ lowLatencyMode: true }}>{/* ... */}</HLSVideo>
    </Media>
  );
}
