import { type HlsElement } from '@vidstack/player';
import { Hls } from '@vidstack/player-react';
import { useEffect, useRef } from 'react';

function MediaPlayer() {
  const provider = useRef<HlsElement>(null);

  useEffect(() => {
    // `hls.js` instance.
    const engine = provider.current!.hlsEngine;
  }, []);

  return <Hls ref={provider}>{/* ... */}</Hls>;
}
