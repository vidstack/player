import { MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* show when paused */}
      <div className="paused:opacity-100 opacity-0"></div>

      {/* hide when paused */}
      <div className="paused:opacity-0 opacity-100"></div>

      {/* hide when _not_ playing */}
      <div className="not-playing:opacity-0 opacity-100"></div>
    </MediaPlayer>
  );
}
