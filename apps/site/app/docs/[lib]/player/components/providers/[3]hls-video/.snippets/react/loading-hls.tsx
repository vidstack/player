import { HLSVideo } from '@vidstack/react';

function MediaPlayer() {
  return (
    <>
      {/* Default development URL. */}
      <HLSVideo hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.js" />
      {/* Default production URL. */}
      <HLSVideo hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js" />
    </>
  );
}
