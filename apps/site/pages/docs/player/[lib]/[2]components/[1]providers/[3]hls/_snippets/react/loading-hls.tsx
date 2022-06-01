import { Hls } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    {/* Default development URL. */}
    <Hls hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.js" />
    {/* Default production URL. */}
    <Hls hlsLibrary="https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.light.min.js" />
  );
}
