import { Gesture, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <Gesture type="click" repeat={0} action="toggle:paused" priority={1} />
    </Media>
  );
}
