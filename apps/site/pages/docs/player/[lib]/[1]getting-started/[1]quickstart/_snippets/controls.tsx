import { Video } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <>
      {/* Add `controls` here if you'd like to show native UI. */}
      <Video controls>
        <video controls></video>
      </Video>
    </>
  );
}
