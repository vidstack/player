import { Slider } from '@vidstack/player/react';

function MySlider() {
  return (
    <Slider min={0} max={100} value={50} step={1}>
      {/* ... */}
    </Slider>
  );
}
