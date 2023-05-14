import {
  MediaPlayer,
  MediaSliderThumbnail,
  MediaSliderValue,
  MediaTimeSlider,
} from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer thumbnails="https://media-files.vidstack.io/thumbnails.vtt">
      <MediaTimeSlider>
        <div slot="preview">
          <MediaSliderThumbnail />
          <MediaSliderValue type="pointer" format="time" />
        </div>
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
