import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player({ live = false }) {
  return (
    <MediaPlayer aspectRatio={16 / 9}>
      {live ? <LivePlayerLayout /> : <VODPlayerLayout />}
    </MediaPlayer>
  );
}

function LivePlayerLayout() {
  return (
    <>
      <div className="media">
        <MediaOutlet />
        <div className="media-controls">{/* ... */}</div>
      </div>
      <div className="chat">{/* ... */}</div>
    </>
  );
}

function VODPlayerLayout() {
  return (
    <>
      <MediaOutlet />
      <div className="media-controls">{/* ... */}</div>
    </>
  );
}
