import { Media, Time } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <div className="media-times">
        <div>
          Current: <Time type="current" />
        </div>
        <div>
          Seekable: <Time type="seekable" />
        </div>
        <div>
          Buffered: <Time type="buffered" />
        </div>
        <div>
          Duration: <Time type="duration" />
        </div>
        <div>
          Remaining: <Time type="current" remainder />
        </div>
      </div>
    </Media>
  );
}
