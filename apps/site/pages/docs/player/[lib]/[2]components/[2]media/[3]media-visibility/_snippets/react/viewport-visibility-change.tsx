import { type MediaVisibilityChangeEvent } from '@vidstack/player';
import { Media, MediaVisibility } from '@vidstack/player/react';

function MediaPlayer() {
  function onVisibilityChange(event: MediaVisibilityChangeEvent) {
    const { viewport } = event.detail;

    if (viewport.isIntersecting) {
      // ...
    }
  }

  return (
    <Media>
      <MediaVisibility onMediaVisibilityChange={onVisibilityChange}>{/* ... */}</MediaVisibility>
    </Media>
  );
}
