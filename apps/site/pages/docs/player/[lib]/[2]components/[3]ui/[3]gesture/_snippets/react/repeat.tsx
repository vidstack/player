import { Gesture, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* Single click. */}
      <Gesture type="click" repeat="0" />
      {/* Double click. */}
      <Gesture type="click" repeat="1" />
    </Media>
  );
}
