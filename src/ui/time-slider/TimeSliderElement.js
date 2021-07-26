import { consumeContext, watchContext } from '@base/context/index.js';
import { eventListener, isPointerEvent } from '@base/events/index.js';
import { mediaContext, MediaRemoteControl } from '@media/index.js';
import { setAttribute } from '@utils/dom.js';
import { clampNumber, round } from '@utils/number.js';
import { formatSpokenTime } from '@utils/time.js';
import { throttle } from '@utils/timing.js';
import { property, state } from 'lit/decorators.js';

import { SliderElement } from '../slider/index.js';

export const TIME_SLIDER_ELEMENT_TAG_NAME = 'vds-time-slider';

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
  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  label = 'Media time slider';
  shiftKeyMultiplier = 2;

  /**
   * Represents the current % of media playback.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  value = -1;

  // These properties are overriden in final render by methods below.
  /** @internal */
  @property({ attribute: false })
  min = 0;
  /** @internal */
  @property({ attribute: false })
  max = 100;
  /** @internal */
  @property({ attribute: false })
  valueMin = '0';
  /** @internal */
  @property({ attribute: false })
  valueNow = '0';
  /** @internal */
  @property({ attribute: false })
  valueMax = '0';

  /**
   * @protected
   * @type {number}
   */
  _step = 0.25;

  /**
   *  A number that specifies the granularity that the slider value must adhere to in seconds.
   * For example, a step with the value `1` indicates a granularity of 1 second increments.
   *
   * @type {number}
   * @default 0.25
   */
  @property({ type: Number })
  // @ts-ignore - Defined as accessor here but property in parent class.
  get step() {
    return this._mediaDuration > 0
      ? round((this._step / this._mediaDuration) * 100, 2)
      : this._step;
  }

  set step(newStep) {
    this._step = newStep;
  }

  /**
   * @protected
   * @type {number}
   */
  _keyboardStep = 5;

  /**
   * ♿ **ARIA:** A number that specifies the number of seconds to step when interacting
   * with the slider via keyboard.
   *
   * @type {number}
   * @default 5
   */
  @property({ attribute: 'keyboard-step', type: Number })
  // @ts-ignore - Defined as accessor here but property in parent class.
  get keyboardStep() {
    return this._mediaDuration > 0
      ? round((this._keyboardStep / this._mediaDuration) * 100, 2)
      : this._keyboardStep;
  }

  set keyboardStep(newStep) {
    this._keyboardStep = newStep;
  }

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current slider value. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   *
   * @type {string}
   */
  valueText = '{currentTime} out of {duration}';

  /**
   * Whether the scrubber should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   *
   * @type {boolean}
   */
  @property({ attribute: 'pause-while-dragging', type: Boolean })
  pauseWhileDragging = false;

  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   *
   * @type {number}
   */
  @property({ attribute: 'seeking-request-throttle', type: Number })
  seekingRequestThrottle = 100;

  /**
   * @protected
   * @type {number}
   */
  @state()
  @consumeContext(mediaContext.currentTime)
  _mediaCurrentTime = 0;

  /**
   * @protected
   * @type {number}
   */
  @state()
  @consumeContext(mediaContext.duration, { transform: (d) => (d >= 0 ? d : 0) })
  _mediaDuration = 0;

  /**
   * @protected
   * @type {boolean}
   */
  @state()
  @consumeContext(mediaContext.paused)
  _mediaPaused = mediaContext.paused.initialValue;

  /**
   * The current media time.
   *
   * @type {number}
   */
  get currentTime() {
    return this._mediaDuration * (this.value / 100);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('seekingRequestThrottle')) {
      this._dispatchSeekingRequest.updateDelay(this.seekingRequestThrottle);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this._dispatchSeekingRequest.cancel();
    }

    super.update(changedProperties);
  }

  disconnectedCallback() {
    this._dispatchSeekingRequest.cancel();
    super.disconnectedCallback();
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @returns {string}
   */
  _getValueNow() {
    const valueNow = this._mediaDuration * (this.value / 100);
    return String(Math.round(valueNow));
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueMax() {
    return String(Math.round(this._mediaDuration));
  }

  /**
   * @protected
   * @returns {string}
   */
  _getValueText() {
    const currentTime = this._mediaDuration * (this.value / 100);

    return this.valueText
      .replace('{currentTime}', formatSpokenTime(currentTime))
      .replace('{duration}', formatSpokenTime(this._mediaDuration));
  }

  /**
   * @protected
   * @param {import('../slider').SliderDragStartEvent} event
   * @returns {void}
   */
  @eventListener('vds-slider-drag-start')
  _handleSliderDragStart(event) {
    this._togglePlaybackWhileDragging(event);
  }

  /**
   * @protected
   * @readonly
   */
  _mediaRemote = new MediaRemoteControl(this);

  /**
   * @protected
   * @param {import('../slider').SliderValueChangeEvent} event
   * @returns {void}
   */
  @eventListener('vds-slider-value-change')
  _handleSliderValueChange(event) {
    this.value = event.detail;

    if (this.isDragging) {
      this._dispatchSeekingRequest(event);
    }

    if (!isPointerEvent(event.originalEvent)) {
      this._dispatchSeekingRequest.cancel();
      this._mediaRemote.seek(this.currentTime, event);
    }
  }

  /**
   * @protected
   * @param {import('../slider').SliderDragEndEvent} event
   * @returns {void}
   */
  @eventListener('vds-slider-drag-end')
  _handleSliderDragEnd(event) {
    this._dispatchSeekingRequest.cancel();
    this._mediaRemote.seek(this.currentTime, event);
    this._togglePlaybackWhileDragging(event);
  }

  /**
   * @protected
   * @readonly
   * @type {import('@utils/timing').ThrottledFunction<(event: Event) => void>}
   */
  _dispatchSeekingRequest = throttle((event) => {
    this._mediaRemote.seeking(this.currentTime, event);
  }, this.seekingRequestThrottle);

  /**
   * @protected
   */
  @watchContext(mediaContext.currentTime)
  @watchContext(mediaContext.duration)
  _updateValueToCurrentTime() {
    if (this.isDragging) return;

    const percentage =
      this._mediaDuration > 0
        ? (this._mediaCurrentTime / this._mediaDuration) * 100
        : 0;

    this.value = clampNumber(0, round(percentage, 5), 100);
  }

  /**
   * @protected
   * @param {boolean} canPlay
   */
  @watchContext(mediaContext.canPlay)
  _handleCanPlayContextUpdate(canPlay) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  /**
   * @protected
   * @type {boolean}
   */
  _wasPlayingBeforeDragStart = false;

  /**
   * @protected
   * @param {Event} event
   */
  _togglePlaybackWhileDragging(event) {
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
