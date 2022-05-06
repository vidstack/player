import './styling.css';

import { AspectRatio, Gesture, Media, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video>
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </AspectRatio>

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
};
