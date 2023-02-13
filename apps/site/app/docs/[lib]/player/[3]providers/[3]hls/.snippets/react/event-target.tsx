import { MediaPlayer } from '@vidstack/react';
import { isHTMLVideoElement, type MediaLoadedMetadataEvent } from 'vidstack';

function Player() {
  function onLoadedMetadata(event: MediaLoadedMetadataEvent) {
    // Available on all media events!
    const target = event.trigger?.target;
    if (isHTMLVideoElement(target)) {
      target; // HTMLVideoElement
    }
  }

  return <MediaPlayer onLoadedMetadata={onLoadedMetadata}>{/* ... */}</MediaPlayer>;
}
