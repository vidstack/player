import { Hls } from '@vidstack/player/react';
import hlsjs from 'hls.js';

function MediaPlayer() {
  return <Hls hlsLibrary={hlsjs}>{/* ... */}</Hls>;
}
