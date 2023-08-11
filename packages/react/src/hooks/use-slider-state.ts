import type { RefObject } from 'react';
import { useSignal, useSignalRecord, useStateContext } from 'maverick.js/react';
import { sliderState, type SliderState } from 'vidstack/local';
import type { SliderInstance } from '../components/primitives/instances';

/**
 * This hook is used to subscribe to a single slider state.
 *
 * @docs {@link https://vidstack.io/docs/react/player/components/sliders/slider#subscribe}
 */
export function useSliderState<T extends keyof SliderState>(
  prop: T,
  ref?: RefObject<SliderInstance | null>,
): SliderState[T] {
  const $state = useStateContext(sliderState);

  if (__DEV__ && !$state && !ref) {
    console.warn(
      `[vidstack] \`useMediaState\` requires \`RefObject<MediaPlayerInstance>\` argument if called` +
        ' outside the `<MediaPlayer>` component',
    );
  }

  return useSignal((ref?.current?.$state || $state)[prop]);
}

/**
 * This hook is used to subscribe to the current slider state on the given or nearest slider
 * component.
 *
 * @docs {@link https://vidstack.io/docs/react/player/components/sliders/slider#subscribe}
 */
export function useSliderStore(ref?: RefObject<SliderInstance | null>): Readonly<SliderState> {
  const $state = useStateContext(sliderState);

  if (__DEV__ && !$state && !ref) {
    console.warn(
      `[vidstack] \`useSliderStore\` requires \`RefObject<SliderInstance>\` argument if called` +
        ' outside of a slider component',
    );
  }

  return useSignalRecord(ref?.current?.$state || $state);
}
