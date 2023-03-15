import { MediaPlayer } from '@vidstack/react';
import { type MediaTextTrackChangeEvent, type MediaTextTracksChangeEvent } from 'vidstack';

function Player() {
  function onTextTracksChange(event: MediaTextTracksChangeEvent) {
    const newTracks = event.detail; // `TextTrack[]`
  }

  function onTextTrackChange(event: MediaTextTrackChangeEvent) {
    const currentTrack = event.detail; // `TextTrack | null`
  }

  return (
    <MediaPlayer onTextTracksChange={onTextTracksChange} onTextTrackChange={onTextTrackChange}>
      {/* ... */}
    </MediaPlayer>
  );
}
