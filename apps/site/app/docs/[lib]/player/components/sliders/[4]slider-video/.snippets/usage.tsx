import { Media, SliderVideo, TimeSlider } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      <TimeSlider>
        <SliderVideo src="https://media-files.vidstack.io/240p.mp4" slot="preview" />
      </TimeSlider>
    </Media>
  );
}
