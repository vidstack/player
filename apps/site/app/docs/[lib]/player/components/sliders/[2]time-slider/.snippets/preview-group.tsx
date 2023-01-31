import {
  MediaPlayer,
  MediaSliderValueText,
  MediaSliderVideo,
  MediaTimeSlider,
} from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTimeSlider>
        <div slot="preview">
          <MediaSliderVideo src="https://media-files.vidstack.io/240p.mp4" />
          <MediaSliderValueText type="pointer" format="time" />
        </div>
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
