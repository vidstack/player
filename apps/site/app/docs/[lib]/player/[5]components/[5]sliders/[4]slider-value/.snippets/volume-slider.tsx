import { MediaPlayer, MediaSliderValue, MediaVolumeSlider } from '@vidstack/react';

function Player() {
  return (
    <MediaPlayer>
      {/* ... */}
      <MediaVolumeSlider>
        <MediaSliderValue type="pointer" format="percent" slot="preview" />
      </MediaVolumeSlider>
    </MediaPlayer>
  );
}
