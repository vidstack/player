import { SliderElement, SliderElementProps } from '../slider';

export const SCRUBBER_ELEMENT_TAG_NAME = `scrubber`;

export interface ScrubberElementProps
  extends Pick<
    SliderElementProps,
    'step' | 'stepMultiplier' | 'orientation' | 'throttle'
  > {
  /**
   * ♿ **ARIA:** The `aria-label` for the slider.
   */
  sliderLabel: string;

  /**
   * ♿ **ARIA:** The `aria-label` for the buffered progress bar.
   */
  progressLabel: string;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current scrubber progress. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `20 minutes out of 1 hour, 20 minutes. `
   */
  progressText: string;

  /**
   * Whether the scrubber is hidden.
   */
  hidden: boolean;

  /**
   * Whether the scubber is disabled.
   */
  disabled: boolean;

  /**
   * Whether the preview passed in should NOT be clamped to the scrubber edges. In other words,
   * setting this to `true` means the preview element can escape the scrubber bounds.
   */
  noPreviewClamp: boolean;

  /**
   * Whether to remove the preview track.
   */
  noPreviewTrack: boolean;

  /**
   * Whether the scrubber should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  pauseWhileDragging: boolean;

  /**
   * The amount of milliseconds to throttle preview time updates by.
   */
  previewTimeThrottle: number;

  /**
   * The amount of milliseconds to throttle user seeking events being dispatched.
   */
  userSeekingThrottle: number;

  /**
   * The component's root element.
   *
   * @default HTMLElement
   */
  readonly rootElement: HTMLElement;

  /**
   * Returns the underlying `<progress>` element.
   *
   * @default HTMLProgressElement
   */
  readonly progressElement: HTMLProgressElement;

  /**
   * Returns the underlying preview track fill element (`<div>`). This will be `undefined` if
   * you set the `noPreviewTrack` property to true.
   *
   * @default HTMLDivElement
   */
  readonly previewTrackElement: HTMLDivElement | undefined;

  /**
   * Returns the underlying `vds-slider` component.
   */
  readonly slider: SliderElement;

  /**
   * Whether the user is seeking by either hovering over the scrubber or by dragging the thumb.
   *
   * @default false
   */
  readonly isSeeking: boolean;

  /**
   * The root element passed in to the `preview` slot.
   *
   * @default undefined
   */
  readonly currentPreviewElement: HTMLElement | undefined;
}
