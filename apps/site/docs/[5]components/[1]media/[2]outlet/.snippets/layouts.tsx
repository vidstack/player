import { MediaPlayer, MediaProvider } from '@vidstack/react';

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
        <MediaProvider />
        <div className="media-controls">{/* ... */}</div>
      </div>
      <div className="chat">{/* ... */}</div>
    </>
  );
}

function VODPlayerLayout() {
  return (
    <>
      <MediaProvider />
      <div className="media-controls">{/* ... */}</div>
    </>
  );
}
