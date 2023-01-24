import { HLSVideo, Media } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { HLSVideoElement } from 'vidstack';

function MediaPlayer() {
  const provider = useRef<HLSVideoElement>(null);

  useEffect(() => {
    // Refer to events to be notified when ctor or engine is defined.
    const { ctor, engine, supported, attached } = provider.current!.hls;
  }, []);

  return (
    <Media>
      <HLSVideo ref={provider}>{/* ... */}</HLSVideo>
    </Media>
  );
}
