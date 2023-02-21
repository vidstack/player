import { type MediaLiveChangeEvent, type MediaLiveEdgeChangeEvent } from 'vidstack';

const player = document.querySelector('media-player');

player.addEventListener('live-change', (event: MediaLiveChangeEvent) => {
  const isLive = event.detail;
});

player.addEventListener('live-edge-change', (event: MediaLiveEdgeChangeEvent) => {
  const atLiveEdge = event.detail;
});
