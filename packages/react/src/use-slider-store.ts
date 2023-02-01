import { useReactContext } from 'maverick.js/react';
import type { RefObject } from 'react';
import { MediaSliderElement, sliderStore, SliderStore, sliderStoreContext } from 'vidstack';

import { useStore } from './use-store';

/**
 * This hook is used to subscribe to the current slider state on the given or nearest
 * slider element (e.g., `<media-slider>`, `<media-time-slider>`, `<media-volume-slider>`).
 *
 * @docs {@link https://vidstack.io/docs/react/player/components/sliders/slider#subscribe}
 */
export function useSliderStore(ref?: RefObject<MediaSliderElement | null>): SliderStore {
  const $store = useReactContext(sliderStoreContext);
  return useStore(sliderStore, (ref && 'current' in ref ? ref.current : ref)?.$store ?? $store);
}
