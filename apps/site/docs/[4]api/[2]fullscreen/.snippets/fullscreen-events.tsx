import { MediaPlayer } from '@vidstack/react';
import { type MediaFullscreenChangeEvent, type MediaFullscreenErrorEvent } from 'vidstack';

function Player() {
  function onFullscreenChange(event: MediaFullscreenChangeEvent) {
    const requestEvent = event.request;
    const isFullscreen = event.detail;
  }

  function onFullscreenError(event: MediaFullscreenErrorEvent) {
    const requestEvent = event.request;
    const error = event.detail;
  }

  return (
    <MediaPlayer onFullscreenChange={onFullscreenChange} onFullscreenError={onFullscreenError}>
      {/* ... */}
    </MediaPlayer>
  );
}
