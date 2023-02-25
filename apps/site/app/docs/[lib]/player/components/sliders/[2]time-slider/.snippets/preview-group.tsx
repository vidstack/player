import {
  MediaPlayer,
  MediaSliderThumbnail,
  MediaSliderValueText,
  MediaTimeSlider,
} from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTimeSlider>
        <div slot="preview">
          <MediaSliderThumbnail src="https://media-files.vidstack.io/thumbnails.vtt" />
          <MediaSliderValueText type="pointer" format="time" />
        </div>
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
