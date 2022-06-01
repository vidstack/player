import { Media, TimeSlider } from '@vidstack/player/react';

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
        </TimeSlider>
      </div>
    </Media>
  );
}
