import { Media } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <div className="media-controls-container">
        <div className="media-controls-group">Controls Top</div>
        <div className="media-controls-group">Controls Middle</div>
        <div className="media-controls-group">Controls Bottom</div>
      </div>
    </Media>
  );
}
