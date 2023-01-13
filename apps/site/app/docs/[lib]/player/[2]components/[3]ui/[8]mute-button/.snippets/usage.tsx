import { Media, MuteButton } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <MuteButton>
        <div className="media-mute">Mute</div>
        <div className="media-unmute">Unmute</div>
      </MuteButton>
    </Media>
  );
}
