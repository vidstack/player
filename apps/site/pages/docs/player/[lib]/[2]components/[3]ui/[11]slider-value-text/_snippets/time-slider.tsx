import { Media, SliderValueText, TimeSlider } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <TimeSlider>
        <SliderValueText type="pointer" format="time" />
      </TimeSlider>
    </Media>
  );
}
