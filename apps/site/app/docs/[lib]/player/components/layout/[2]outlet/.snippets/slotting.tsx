import { MediaOutlet, MediaPlayer, MediaPoster } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer aspectRatio={16 / 9}>
      <MediaOutlet>
        {/* Poster will only cover provider region. */}
        <MediaPoster />
      </MediaOutlet>
      {/* Controls can be positioned with CSS outside of provider. */}
      <div className="media-controls">{/* ... */}</div>
    </MediaPlayer>
  );
}
