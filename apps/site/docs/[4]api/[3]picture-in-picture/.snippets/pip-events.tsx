import { MediaPlayer } from '@vidstack/react';
import { type MediaPIPChangeEvent, type MediaPIPErrorEvent } from 'vidstack';

function Player() {
  function onPIPChange(event: MediaPIPChangeEvent) {
    const requestEvent = event.request;
    const isActive = event.detail;
  }

  function onPIPError(event: MediaPIPErrorEvent) {
    const requestEvent = event.request;
    const error = event.detail;
  }

  return (
    <MediaPlayer onPictureInPictureChange={onPIPChange} onPictureInPictureError={onPIPError}>
      {/* ... */}
    </MediaPlayer>
  );
}
