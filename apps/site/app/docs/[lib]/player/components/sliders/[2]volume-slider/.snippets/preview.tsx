import { MediaPlayer, MediaSliderValueText, MediaVolumeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      <MediaVolumeSlider>
        <MediaSliderValueText type="pointer" format="percent" slot="preview" />
      </MediaVolumeSlider>
    </MediaPlayer>
  );
}
