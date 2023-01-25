import { Media } from '@vidstack/react';
import { type MediaFullscreenChangeEvent, type MediaFullscreenErrorEvent } from 'vidstack';

function MediaPlayer() {
  function onFullscreenChange(event: MediaFullscreenChangeEvent) {
    const requestEvent = event.request;
    const isFullscreen = event.detail;
  }

  function onFullscreenError(event: MediaFullscreenErrorEvent) {
    const requestEvent = event.request;
    const error = event.detail;
  }

  return (
    <Media onFullscreenChange={onFullscreenChange} onFullscreenError={onFullscreenError}>
      {/* ... */}
    </Media>
  );
}
