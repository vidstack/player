import { type HlsElement } from '@vidstack/player';
import { Hls } from '@vidstack/player-react';
import { useEffect, useRef } from 'react';

function MediaPlayer() {
  const providerRef = useRef<HlsElement>(null);

  useEffect(() => {
    // `hls.js` instance.
    const engine = providerRef.current!.hlsEngine;
  }, []);

  return <Hls ref={providerRef}>{/* ... */}</Hls>;
}
