import { MediaPlayer, MediaSlider } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { type MediaSliderElement } from 'vidstack';

function Player() {
  const slider = useRef<MediaSliderElement>(null);

  useEffect(() => {
    const {
      focusing,
      dragging,
      pointing,
      interactive,
      fillPercent,
      previewPercent,
      // ...
    } = slider.current!.state;
  }, []);

  return (
    <MediaPlayer>
      {/* ... */}
      <MediaSlider ref={slider}></MediaSlider>
    </MediaPlayer>
  );
}
