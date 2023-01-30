import { MediaPlayer, MediaSliderValueText, MediaTimeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaTimeSlider>
        <MediaSliderValueText type="pointer" format="time" slot="preview" />
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
