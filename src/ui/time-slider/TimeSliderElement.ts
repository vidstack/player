import throttle from 'just-throttle';
import { PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { hostedEventListener, isPointerEvent } from '../../base/events';
import { hostedMediaStoreSubscription, MediaRemoteControl } from '../../media';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
import { clampNumber, round } from '../../utils/number';
import { formatSpokenTime } from '../../utils/time';
import { SliderElement } from '../slider';

/**
 * A slider that lets the user control the current media playback time.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 *
 * @tagname vds-time-slider
 * @example
 * ```html
 * <vds-time-slider label="Media time slider"></vds-time-slider>
 * ```
 * @example
 * ```css
 * vds-time-slider {
 *   --vds-slider-track-height: 2.5px;
 *   --vds-slider-thumb-width: 16px;
 *   --vds-slider-thumb-height: 16px;
 *   --vds-slider-active-color: #ff2a5d;
 * }
 * ```
 */
export class TimeSliderElement extends SliderElement {
  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'currentTime', ($currentTime) => {
      this._mediaCurrentTime = $currentTime;
      this._updateValueToCurrentTime();
    });
    hostedMediaStoreSubscription(this, 'duration', ($duration) => {
      this._mediaDuration = $duration;
    });
    hostedMediaStoreSubscription(this, 'paused', ($paused) => {
      this._mediaPaused = $paused;
    });
    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Media time');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  override shiftKeyMultiplier = 2;

  /**
   * Represents the current % of media playback.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  override value = -1;

  // These properties are overriden in final render by methods below.
  /** @internal */
  @property({ attribute: false })
  override min = 0;
  /** @internal */
  @property({ attribute: false })
  override max = 100;

  protected override _step = 0.25;

  /**
   *  A number that specifies the granularity that the slider value must adhere to in seconds.
   * For example, a step with the value `1` indicates a granularity of 1 second increments.
   *
   * @default 0.25
   */
  @property({ type: Number })
  override get step() {
    return this._mediaDuration > 0
      ? round((this._step / this._mediaDuration) * 100, 2)
      : this._step;
  }

  override set step(newStep: number) {
    this._step = newStep;
  }

  protected override _keyboardStep = 5;

  /**
   * ♿ **ARIA:** A number that specifies the number of seconds to step when interacting
   * with the slider via keyboard.
   *
   * @default 5
   */
  @property({ attribute: 'keyboard-step', type: Number })
  // @ts-ignore - Defined as accessor here but property in parent class.
  get keyboardStep() {
    return this._mediaDuration > 0
      ? round((this._keyboardStep / this._mediaDuration) * 100, 2)
      : this._keyboardStep;
  }

  override set keyboardStep(newStep: number) {
    this._keyboardStep = newStep;
  }

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current slider value. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   */
  @property({ attribute: 'value-text' })
  valueText = '{currentTime} out of {duration}';

  /**
   * Whether the scrubber should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  @property({ attribute: 'pause-while-dragging', type: Boolean })
  pauseWhileDragging = false;

  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   */
  @property({ attribute: 'seeking-request-throttle', type: Number })
  seekingRequestThrottle = 100;

  @state() protected _mediaCurrentTime = 0;
  @state() protected _mediaDuration = 0;
  @state() protected _mediaPaused = true;

  /**
   * The current media time.
   */
  get currentTime() {
    return this._mediaDuration * (this.value / 100);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('disabled') && this.disabled) {
      this._dispatchSeekingRequest.cancel();
    }

    super.update(changedProperties);
  }

  override disconnectedCallback() {
    this._dispatchSeekingRequest.cancel();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  protected override _getValueNow(): string {
    const valueNow = this._mediaDuration * (this.value / 100);
    return String(Math.round(valueNow));
  }

  protected override _getValueMax(): string {
    return String(Math.round(this._mediaDuration));
  }

  protected override _getValueText(): string {
    const currentTime = this._mediaDuration * (this.value / 100);

    return this.valueText
      .replace('{currentTime}', formatSpokenTime(currentTime))
      .replace('{duration}', formatSpokenTime(this._mediaDuration));
  }

  protected readonly _handleSliderDragStart = hostedEventListener(
    this,
    'vds-slider-drag-start',
    (event) => {
      this._togglePlaybackWhileDragging(event);
    }
  );

  protected readonly _mediaRemote = new MediaRemoteControl(this);

  protected readonly _handleSliderValueChange = hostedEventListener(
    this,
    'vds-slider-value-change',
    (event) => {
      this.value = event.detail;

      if (this.isDragging) {
        this._dispatchSeekingRequest(event);
      }

      if (!isPointerEvent(event.originalEvent)) {
        this._dispatchSeekingRequest.cancel();
        this._mediaRemote.seek(this.currentTime, event);
      }
    }
  );

  protected readonly _handleSliderDragEnd = hostedEventListener(
    this,
    'vds-slider-drag-end',
    (event) => {
      this._dispatchSeekingRequest.cancel();
      this._mediaRemote.seek(this.currentTime, event);
      this._togglePlaybackWhileDragging(event);
    }
  );

  protected readonly _dispatchSeekingRequest = throttle((event: Event) => {
    this._mediaRemote.seeking(this.currentTime, event);
  }, this.seekingRequestThrottle);

  protected _updateValueToCurrentTime() {
    if (this.isDragging) return;

    const percentage =
      this._mediaDuration > 0
        ? (this._mediaCurrentTime / this._mediaDuration) * 100
        : 0;

    this.value = clampNumber(0, round(percentage, 5), 100);
  }

  protected _wasPlayingBeforeDragStart = false;

  protected _togglePlaybackWhileDragging(event: Event) {
    if (!this.pauseWhileDragging) return;

    if (this.isDragging && !this._mediaPaused) {
      this._wasPlayingBeforeDragStart = true;
      this._mediaRemote.pause(event);
    } else if (
      this._wasPlayingBeforeDragStart &&
      !this.isDragging &&
      this._mediaPaused
    ) {
      this._wasPlayingBeforeDragStart = false;
      this._mediaRemote.play(event);
    }
  }
}
