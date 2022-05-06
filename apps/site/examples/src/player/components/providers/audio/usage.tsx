import { Audio, Media } from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <Audio controls>
        <audio controls preload="none" src="https://media-files.vidstack.io/audio.mp3" />
      </Audio>
    </Media>
  );
};
