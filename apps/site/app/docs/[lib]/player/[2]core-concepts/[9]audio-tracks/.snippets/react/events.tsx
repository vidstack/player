import { MediaPlayer } from '@vidstack/react';
import { type MediaAudioTrackChangeEvent, type MediaAudioTracksChangeEvent } from 'vidstack';

function Player() {
  function onAudioTracksChange(event: MediaAudioTracksChangeEvent) {
    const newTracks = event.detail; // `AudioTrack[]`
  }

  function onAudioTrackChange(event: MediaAudioTrackChangeEvent) {
    const currentTrack = event.detail; // `AudioTrack | null`
  }

  return (
    <MediaPlayer onAudioTracksChange={onAudioTracksChange} onAudioTrackChange={onAudioTrackChange}>
      {/* ... */}
    </MediaPlayer>
  );
}
