import { MediaPlayer, MediaProvider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer aspectRatio={16 / 9}>
      <MediaProvider />
      <div className="media-ui">{/* ... */}</div>
    </MediaPlayer>
  );
}
