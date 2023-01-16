import { Media, SliderValueText, TimeSlider } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <TimeSlider>
        <SliderValueText type="pointer" format="time" showHours padHours slot="preview" />
      </TimeSlider>
    </Media>
  );
}
