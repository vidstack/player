import { MediaOutlet, MediaPlayer } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer
      src={[
        { src: 'https://media-files.vidstack.io/audio.mp3', type: 'audio/mpeg' },
        { src: 'https://media-files.vidstack.io/audio.ogg', type: 'audio/ogg' },
      ]}
      controls
    >
      <MediaOutlet />
    </MediaPlayer>
  );
}
