import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { type MediaSourceChangeEvent, type MediaSourcesChangeEvent } from 'vidstack';

function Player() {
  function onSourcesChange(event: MediaSourcesChangeEvent) {
    const newSources = event.detail;
  }

  function onSourceChange(event: MediaSourceChangeEvent) {
    const newSource = event.detail;
  }

  return (
    <MediaPlayer onSourcesChange={onSourcesChange} onSourceChange={onSourceChange}>
      <MediaOutlet />
    </MediaPlayer>
  );
}
