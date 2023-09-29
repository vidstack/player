import { MediaPlayer, MediaSlider, useSliderStore } from '@vidstack/react';
import { useRef } from 'react';
import { type MediaSliderElement } from 'vidstack';

function Player() {
  const slider = useRef<MediaSliderElement>(null);

  // - This is a live subscription to the slider `value` state.
  // - All subscriptions are lazily created on prop access.
  // - Ref is not required if called inside a child slider component.
  const { value } = useSliderStore(slider);

  return (
    <MediaPlayer>
      {/* ... */}
      <MediaSlider ref={slider}></MediaSlider>
    </MediaPlayer>
  );
}
