import { FullscreenButton, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <FullscreenButton>
        <div className="media-enter-fs">Enter Fullscreen</div>
        <div className="media-exit-fs">Exit Fullscreen</div>
      </FullscreenButton>
    </Media>
  );
}
