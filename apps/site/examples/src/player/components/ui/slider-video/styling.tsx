import './styling.css';

import {
  AspectRatio,
  Gesture,
  Media,
  SliderValueText,
  SliderVideo,
  TimeSlider,
  Video,
} from '@vidstack/player/react';

export default () => {
  return (
    <Media>
      <AspectRatio ratio="16/9">
        <Video autoplay muted>
          <video preload="none" src="https://media-files.vidstack.io/360p.mp4"></video>
        </Video>
      </AspectRatio>

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

      <Gesture action="toggle:paused" type="click" />
    </Media>
  );
};
