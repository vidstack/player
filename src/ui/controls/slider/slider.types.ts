export const SLIDER_ELEMENT_TAG_NAME = `slider`;

/**
 * The direction to move the thumb, associated with key symbols.
 */
export enum SliderKeyDirection {
  Left = -1,
  ArrowLeft = -1,
  Up = -1,
  ArrowUp = -1,
  Right = 1,
  ArrowRight = 1,
  Down = 1,
  ArrowDown = 1,
}

export interface SliderElementProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the slider.
   */
  label?: string;

  /**
   * The lowest slider value in the range of permitted values.
   */
  min: number;

  /**
   * The greatest slider value in the range of permitted values.
   */
  max: number;

  /**
   * The current slider value.
   */
  value: number;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current value. Defaults to
   * `value:max` ratio as a percentage.
   */
  valueText?: string;

  /**
   * A number that specifies the granularity that the slider value must adhere to.
   */
  step: number;

  /**
   * A number that will be used to multiply the `step` when the `Shift` key is held down and the
   * slider value is changed by pressing `LeftArrow` or `RightArrow`.
   */
  stepMultiplier: number;

  /**
   * Whether the slider should be hidden.
   */
  hidden: boolean;

  /**
   * Whether the slider should be disabled (not-interactable).
   */
  disabled: boolean;

  /**
   * ♿ **ARIA:** Indicates the orientation of the slider.
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * The amount of milliseconds to throttle the slider thumb during `mousemove` / `touchmove`
   * events.
   */
  throttle: number;

  /**
   * Whether the current orientation is horizontal.
   *
   * @default true
   */
  readonly isOrientationHorizontal: boolean;

  /**
   * Whether the current orientation is vertical.
   *
   * @default false
   */
  readonly isOrientationVertical: boolean;

  /**
   * Whether the slider thumb is currently being dragged.
   *
   * @default false
   */
  readonly isDragging: boolean;

  /**
   * The current value to range ratio.
   *
   * @default 0.5
   *
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
   * @default 50
   */
  readonly fillPercent: number;

  /**
   * The component's root element.
   *
   * @default HTMLDivElement
   */
  readonly rootElement: HTMLDivElement;

  /**
   * The thumb container element.
   *
   * @default HTMLDivElement
   */
  readonly thumbContainerElement: HTMLDivElement;

  /**
   * The thumb element.
   *
   * @default HTMLDivElement
   */
  readonly thumbElement: HTMLDivElement;

  /**
   * The track element.
   *
   * @default HTMLDivElement
   */
  readonly trackElement: HTMLDivElement;

  /**
   * The track fill element.
   *
   * @default HTMLDivElement
   */
  readonly trackFillElement: HTMLDivElement;
}
