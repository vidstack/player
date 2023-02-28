import { MediaPlayer, MediaSliderValue, MediaTimeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      <MediaTimeSlider>
        <MediaSliderValue type="pointer" format="time" showHours padHours slot="preview" />
      </MediaTimeSlider>
    </MediaPlayer>
  );
}
