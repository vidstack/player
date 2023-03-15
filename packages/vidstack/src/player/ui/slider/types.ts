import type { Dispose, Maybe } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';

import type { SliderCSSVars } from './cssvars';
import type { SliderEvents } from './events';
import type { SliderProps } from './props';
import type { SliderStore } from './store';

export { SliderProps, SliderEvents, SliderCSSVars };

export interface SliderMembers extends SliderProps {
  /* @internal */
  $store: SliderStore;
  /**
   * This object contains all current slider state (e.g., `dragging`, `fillPercent`, etc.).
   */
  state: Readonly<SliderStore>;
  /**
   * Enables subscribing to live updates of individually selected slider state.
   *
   * @example
   * ```ts
   * slider.subscribe(({ value, dragging, pointing }) => {
   *   // ...
   * });
   * ```
   */
  subscribe: SliderSubscribe;
}

export interface SliderSubscribe {
  (callback: (store: SliderStore) => Maybe<Dispose>): Dispose;
}

/**
 * A custom-built range input that is cross-browser friendly, ARIA friendly, mouse/touch-friendly
 * and easily style-able. The slider allows users to input numeric values between a minimum and
 * maximum value.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider}
 * @example
 * ```html
 * <media-slider min="0" max="100" value="50" aria-label="..."></media-slider>
 * ```
 */
export interface MediaSliderElement
  extends HTMLCustomElement<SliderProps, SliderEvents, SliderCSSVars>,
    SliderMembers {}
