import { MediaPlayer, MediaSliderThumbnail, MediaTimeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTimeSlider>
        <MediaSliderThumbnail src="https://media-files.vidstack.io/thumbnails.vtt" slot="preview" />
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
