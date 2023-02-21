import { MediaPlayer } from '@vidstack/react';
import { type MediaLiveChangeEvent, type MediaLiveEdgeChangeEvent } from 'vidstack';

function Player() {
  function onLiveChange(event: MediaLiveChangeEvent) {
    const isLive = event.detail;
  }

  function onLiveEdgeChange(event: MediaLiveEdgeChangeEvent) {
    const atLiveEdge = event.detail;
  }

  return (
    <MediaPlayer onLiveChange={onLiveChange} onLiveEdgeChange={onLiveEdgeChange}>
      {/* ... */}
    </MediaPlayer>
  );
}
