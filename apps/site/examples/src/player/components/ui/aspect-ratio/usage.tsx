import './usage.css';

import { AspectRatio, Media, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9" min-height="150px" max-height="100vh">
        <Video controls poster="https://media-files.vidstack.io/poster.png">
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </AspectRatio>
    </Media>
  );
};
