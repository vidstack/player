import './styling.css';

import { AspectRatio, Media, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video>{/* ... */}</Video>
      </AspectRatio>

      <div className="media-controls-container">
        <div className="media-controls">Controls Top</div>
        <div className="media-controls">Controls Middle</div>
        <div className="media-controls">Controls Bottom</div>
      </div>
    </Media>
  );
};
