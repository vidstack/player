import { type MediaVisibilityChangeEvent } from '@vidstack/player';
import { Media, MediaVisibility } from '@vidstack/player/react';

function MediaPlayer() {
  function onVisibilityChange(event: MediaVisibilityChangeEvent) {
    const { page } = event.detail;

    // state can be: 'active' | 'passive' | 'hidden'
    // visibility can be: 'visible' | 'hidden'
    const { state, visibility } = page;

    if (state === 'hidden') {
      // ...
    }
  }

  return (
    <Media>
      <MediaVisibility onMediaVisibilityChange={onVisibilityChange}>{/* ... */}</MediaVisibility>
    </Media>
  );
}
