import {
  MediaPlayer,
  MediaSliderThumbnail,
  MediaSliderValue,
  MediaTimeSlider,
} from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTimeSlider>
        <div slot="preview">
          <MediaSliderThumbnail src="https://media-files.vidstack.io/thumbnails.vtt" />
          <MediaSliderValue type="pointer" format="time" />
        </div>
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
