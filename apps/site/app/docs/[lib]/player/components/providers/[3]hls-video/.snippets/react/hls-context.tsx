import { HLSVideo, Media, useCustomElement } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import type { HLSVideoElement } from 'vidstack';

function MediaPlayer() {
  const providerRef = useRef<HLSVideoElement>(null),
    provider = useCustomElement(providerRef);

  useEffect(() => {
    if (!provider) return;
    // Refer to events to be notified when ctor or engine is defined.
    const { ctor, engine, supported, attached } = provider.hls;
  }, [provider]);

  return (
    <Media>
      <HLSVideo ref={providerRef}>{/* ... */}</HLSVideo>
    </Media>
  );
}
