import { Gesture, Media } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <Gesture type="mouseleave" action="pause"></Gesture>
      <Gesture type="click" action="toggle:paused"></Gesture>
      <Gesture type="click" repeat={1} priority={1} action="toggle:fullscreen"></Gesture>
      <Gesture
        className="seek-gesture left"
        type="click"
        repeat={1}
        priority={0}
        action="seek:-30"
      ></Gesture>
      <Gesture
        className="seek-gesture right"
        type="click"
        repeat={1}
        priority={0}
        action="seek:30"
      ></Gesture>
    </Media>
  );
}
