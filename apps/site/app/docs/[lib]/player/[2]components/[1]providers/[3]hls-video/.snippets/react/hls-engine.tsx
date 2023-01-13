import { HLSVideo } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { HLSVideoElement } from 'vidstack';

function MediaPlayer() {
  const provider = useRef<HLSVideoElement>(null);

  useEffect(() => {
    // `hls.js` instance.
    const engine = provider.current!.hls.engine;
  }, []);

  return <HLSVideo ref={provider}>{/* ... */}</HLSVideo>;
}
