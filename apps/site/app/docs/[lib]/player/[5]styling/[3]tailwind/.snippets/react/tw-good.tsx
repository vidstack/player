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

      {/* filled playback track where color changes if buffering (i.e., waiting) */}
      <div className="relative h-6 w-full bg-gray-200">
        <div className="waiting:bg-sky-500 absolute top-0 left-0 h-full w-full origin-left scale-x-[calc(var(--media-current-time)/var(--media-duration))] bg-gray-400 will-change-transform"></div>
      </div>
    </MediaPlayer>
  );
}
