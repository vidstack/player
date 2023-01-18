import { createContext, createStore, useContext } from 'maverick.js';

const sliderStore = createStore<SliderStore>({
  min: 0,
  max: 100,
  value: 50,
  pointerValue: 0,
  dragging: false,
  pointing: false,
  get interactive() {
    return this.dragging || this.pointing;
  },
  get fillRate() {
    const range = this.max - this.min,
      offset = this.value - this.min;
    return range > 0 ? offset / range : 0;
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    const range = this.max - this.min,
      offset = this.pointerValue - this.min;
    return range > 0 ? offset / range : 0;
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  },
});

export const SliderStoreContext = createContext(() => sliderStore.create());

export function useSliderStore(): Readonly<SliderStore> {
  return useContext(SliderStoreContext);
}

export interface SliderStore {
  /**
   * The current slider value.
   */
  value: number;
  /**
   * The value at which the device pointer is pointing to inside the slider.
   */
  pointerValue: number;
  /**
   * The minimum slider value.
   */
  min: number;
  /**
   * The maximum slider value.
   */
  max: number;
  /**
   * Whether the slider thumb is currently being dragged.
   */
  dragging: boolean;
  /**
   * Whether a device pointer is within the slider bounds.
   */
  pointing: boolean;
  /**
   * Whether the slider is being interacted with.
   */
  readonly interactive: boolean;
  /**
   * The current value to range ratio.
   *
   * @signal
   * @example
   * `min` = 0
   * `max` = 10
   * `value` = 5
   * `range` = 10 (max - min)
   * `fillRate` = 0.5 (result)
   */
  readonly fillRate: number;
  /**
   * The fill rate expressed as a percentage (`fillRate * 100`).
   *
   * @signal
   */
  readonly fillPercent: number;
  /**
   * The pointer value to range ratio.
   *
   * @signal
   */
  readonly pointerRate: number;
  /**
   * The pointer rate expressed as a percentage (`pointerRate * 100`).
   *
   * @signal
   */
  readonly pointerPercent: number;
}
