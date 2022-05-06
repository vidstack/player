import './styling.css';

import { Slider } from '@vidstack/player/react';

export default () => {
  return (
    <Slider>
      <div className="slider-track"></div>
      <div className="slider-track fill"></div>
      <div className="slider-thumb-container">
        <div className="slider-thumb"></div>
      </div>
    </Slider>
  );
};
