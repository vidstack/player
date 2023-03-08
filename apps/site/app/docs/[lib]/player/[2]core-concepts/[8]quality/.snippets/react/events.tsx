import { MediaPlayer } from '@vidstack/react';
import { type MediaQualitiesChangeEvent, type MediaQualityChangeEvent } from 'vidstack';

function Player() {
  function onQualitiesChange(event: MediaQualitiesChangeEvent) {
    const newQualities = event.detail; // `VideoQuality[]`
  }

  function onQualityChange(event: MediaQualityChangeEvent) {
    const currentQuality = event.detail; // `VideoQuality | null`
  }

  return (
    <MediaPlayer onQualitiesChange={onQualitiesChange} onQualityChange={onQualityChange}>
      {/* ... */}
    </MediaPlayer>
  );
}
