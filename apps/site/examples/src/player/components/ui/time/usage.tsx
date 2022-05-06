import './usage.css';

import { AspectRatio, Gesture, Media, Time, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video autoplay muted>
          <video preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </AspectRatio>

      <div className="media-times">
        <code>
          Current:&nbsp;
          <Time type="current" />
        </code>
        <code>
          Seekable:&nbsp;
          <Time type="seekable" />
        </code>
        <code>
          Buffered:&nbsp;
          <Time type="buffered" />
        </code>
        <code>
          Duration:&nbsp;
          <Time type="duration" />
        </code>
        <code>
          Remaining:&nbsp;
          <Time type="current" remainder />
        </code>
      </div>

      <Gesture action="toggle:paused" type="click"></Gesture>
    </Media>
  );
};
