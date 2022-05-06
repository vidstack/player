import './styling.css';

import { AspectRatio, Gesture, Media, PlayButton, Poster, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video poster="https://media-files.vidstack.io/poster.png">
          <video controls preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </AspectRatio>

      <Poster alt="Large alien ship hovering over New York."></Poster>

      <div className="big-play-button-container">
        <PlayButton className="big-play-button">
          <svg className="play-icon" aria-hidden="true" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
            />
          </svg>
        </PlayButton>
      </div>

      <Gesture action="toggle:paused" type="click" />
    </Media>
  );
};
