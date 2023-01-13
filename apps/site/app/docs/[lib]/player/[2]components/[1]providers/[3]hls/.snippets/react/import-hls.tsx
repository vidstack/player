import { Hls } from '@vidstack/react';
import Hlsjs from 'hls.js';

function MediaPlayer() {
  return <Hls hlsLibrary={Hlsjs}>{/* ... */}</Hls>;
}
