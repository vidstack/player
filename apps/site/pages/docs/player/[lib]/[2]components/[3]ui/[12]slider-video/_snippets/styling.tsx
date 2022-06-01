import { Media, SliderValueText, SliderVideo, TimeSlider } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <div className="media-controls">
        <TimeSlider>
          <div className="slider-track"></div>
          <div className="slider-track fill"></div>
          <div className="slider-thumb-container">
            <div className="slider-thumb"></div>
          </div>

          <div className="media-preview-container">
            <SliderVideo src="https://media-files.vidstack.io/240p.mp4" />
            <SliderValueText type="pointer" format="time" />
          </div>
        </TimeSlider>
      </div>
    </Media>
  );
}
