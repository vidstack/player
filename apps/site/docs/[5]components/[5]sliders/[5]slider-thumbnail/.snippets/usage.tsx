import { MediaPlayer, MediaSliderThumbnail, MediaTimeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer thumbnails="https://media-files.vidstack.io/thumbnails.vtt">
      <MediaTimeSlider>
        <MediaSliderThumbnail slot="preview" />
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
