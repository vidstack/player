import { MediaPlayer, MediaPoster, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer aspectRatio={16 / 9}>
      <MediaProvider>
        {/* Poster will only cover provider region. */}
        <MediaPoster />
      </MediaProvider>
      {/* Controls can be positioned with CSS outside of provider. */}
      <div className="media-controls">{/* ... */}</div>
    </MediaPlayer>
  );
}
