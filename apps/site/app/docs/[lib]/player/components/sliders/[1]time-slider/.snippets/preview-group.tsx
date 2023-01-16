import { Media, SliderValueText, TimeSlider } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <TimeSlider>
        <div slot="preview">
          <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
          <SliderValueText type="pointer" format="time" />
        </div>
      </TimeSlider>
    </Media>
  );
}
