import { Media, SliderValueText, VolumeSlider } from '@vidstack/react';

function MediaPlayer() {
  return (
    <Media>
      {/* ... */}
      <VolumeSlider>
        <SliderValueText type="pointer" format="percent" slot="preview" />
      </VolumeSlider>
    </Media>
  );
}
