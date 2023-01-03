import type { CustomElementPropDefinitions } from 'maverick.js/element';

import { SliderProps, sliderProps } from '../slider/props';

export const timeSliderProps: CustomElementPropDefinitions<TimeSliderProps> = {
  ...sliderProps,
  step: { initial: 0.1 },
  min: { initial: 0, attribute: false },
  max: { initial: 0, attribute: false },
  value: { initial: 0, attribute: false },
  pauseWhileDragging: { initial: false },
  seekingRequestThrottle: { initial: 100 },
};

export interface TimeSliderProps extends SliderProps {
  /**
   * Whether it should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  pauseWhileDragging: boolean;
  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   */
  seekingRequestThrottle: number;
}
