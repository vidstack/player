import { Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <div className="media-controls-container">
        <div className="media-controls">Controls Top</div>
        <div className="media-controls">Controls Middle</div>
        <div className="media-controls">Controls Bottom</div>
      </div>
    </Media>
  );
}
