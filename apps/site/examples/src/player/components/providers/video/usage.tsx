import { Media, Video } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <Video controls poster="https://media-files.vidstack.io/poster.png">
        <video
          controls
          preload="none"
          src="https://media-files.vidstack.io/720p.mp4"
          poster="https://media-files.vidstack.io/poster-seo.png"
        />
      </Video>
    </Media>
  );
};
