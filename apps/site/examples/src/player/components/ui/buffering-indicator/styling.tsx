import './styling.css';

import { AspectRatio, Media, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video>{/* ... */}</Video>
      </AspectRatio>

      <div className="media-buffering-container">
        <svg className="media-buffering-icon" fill="none" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            className="media-buffering-track"
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
          ></circle>
          <circle
            className="media-buffering-track-fill"
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="10"
            pathLength="100"
          ></circle>
        </svg>
      </div>
    </Media>
  );
};
