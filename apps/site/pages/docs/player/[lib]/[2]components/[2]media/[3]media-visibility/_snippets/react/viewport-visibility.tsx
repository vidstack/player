import { Media, MediaVisibility } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      <MediaVisibility
        enterViewport="play"
        exitViewport="pause"
        intersectionThreshold="1"
        viewportEnterDelay="0"
      >
        {/* ... */}
      </MediaVisibility>
    </Media>
  );
}
