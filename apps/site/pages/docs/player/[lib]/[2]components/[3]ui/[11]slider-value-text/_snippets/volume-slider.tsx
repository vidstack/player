import { Media, SliderValueText, VolumeSlider } from '@vidstack/player/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <VolumeSlider>
        <SliderValueText type="current" format="percent" />
      </VolumeSlider>
    </Media>
  );
}
