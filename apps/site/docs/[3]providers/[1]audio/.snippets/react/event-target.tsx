import { MediaPlayer } from '@vidstack/react';
import { isHTMLAudioElement, type MediaLoadedMetadataEvent } from 'vidstack';

function Player() {
  function onLoadedMetadata(event: MediaLoadedMetadataEvent) {
    // Available on all media events!
    const target = event.trigger?.target;
    if (isHTMLAudioElement(target)) {
      target; // HTMLAudioElement
    }
  }

  return <MediaPlayer onLoadedMetadata={onLoadedMetadata}>{/* ... */}</MediaPlayer>;
}
