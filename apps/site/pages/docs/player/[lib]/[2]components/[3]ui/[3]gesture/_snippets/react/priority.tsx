import { Gesture, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* Lower priority. */}
      <Gesture type="click" priority="1" action="toggle:paused" />
      {/* Higher priority. */}
      <Gesture type="click" repeat="1" priority="0" action="seek:30" />
    </Media>
  );
}
