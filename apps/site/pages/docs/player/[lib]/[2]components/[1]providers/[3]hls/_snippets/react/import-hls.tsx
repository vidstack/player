import { Hls } from '@vidstack/player-react';
import Hlsjs from 'hls.js';

function MediaPlayer() {
  return <Hls hlsLibrary={Hlsjs}>{/* ... */}</Hls>;
}
