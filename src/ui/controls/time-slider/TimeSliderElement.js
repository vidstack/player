// ** Dependencies **
import '../slider/define.js';

import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import {
  forwardEvent,
  ifNonEmpty,
  on
} from '../../../foundation/directives/index.js';
import { VdsElement } from '../../../foundation/elements/index.js';
import { isPointerEvent } from '../../../foundation/events/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import {
  mediaContext,
  MediaRemoteControl,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent
} from '../../../media/index.js';
import { buildExportPartsAttr } from '../../../utils/dom.js';
import { clampNumber, round } from '../../../utils/number.js';
import { formatSpokenTime } from '../../../utils/time.js';
import { throttle } from '../../../utils/timing';
import {
  SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderElement,
  SliderValueChangeEvent
} from '../slider/index.js';
import { timeSliderElementStyles } from './styles.js';

export const TIME_SLIDER_ELEMENT_TAG_NAME = 'vds-time-slider';

/**
 * A slider that lets the user control the current media playback time.
 *
 * @tagname vds-time-slider
 * @slot Used to pass content into the slider component.
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix.
 * @cssprop --vds-slider-* - All slider CSS properties can be used to style the underlying `<vds-slider>` component.
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
export class TimeSliderElement extends VdsElement {
  /**
   * @type {import('lit').CSSResultGroup}
   */
  static get styles() {
    return [timeSliderElementStyles];
  }

  /**
   * @type {string[]}
   */
  static get parts() {
    const sliderExportParts = SliderElement.parts.map(
      (part) => `slider-${part}`
    );

    return ['slider', ...sliderExportParts];
  }

  /**
   * @protected
   * @readonly
   */
  remoteControl = new MediaRemoteControl(this);

  constructor() {
    super();

    // Properties
    /**
     * Whether the scubber is disabled.
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * Whether the scrubber is hidden.
     *
     * @type {boolean}
     */
    this.hidden = false;

    /**
     * The slider orientation.
     *
     * @type {'horizontal' | 'vertical'}
     */
    this.orientation = 'horizontal';

    /**
     * Whether the scrubber should request playback to pause while the user is dragging the
     * thumb. If the media was playing before the dragging starts, the state will be restored by
     * dispatching a user play request once the dragging ends.
     *
     * @type {boolean}
     */
    this.pauseWhileDragging = false;

    /**
     * ♿ **ARIA:** Human-readable text alternative for the current slider value. If you pass
     * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
     * the spoken form such as `1 hour 30 minutes`.
     *
     * @type {string}
     */
    this.valueText = '{currentTime} out of {duration}';

    /**
     * ♿ **ARIA:** The `aria-label` for the slider.
     *
     * @type {string}
     */
    this.label = 'Media time slider';

    /**
     * A number that specifies the granularity that the slider value must adhere to in seconds.
     * For example, a step with the value `1` indicates a granularity of 1 second increments.
     *
     * @type {number}
     */
    this.step = 0.25;

    /**
     * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
     * the slider via keyboard. Think of it as `this.step * this.keyboardStep`.
     *
     * @type {number}
     */
    this.keyboardStep = 20;

    /**
     * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
     * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
     * of it as `this.keyboardStep * this.shiftKeyMultiplier`.
     *
     * @type {number}
     */
    this.shiftKeyMultiplier = 2;

    /**
     * The amount of milliseconds to throttle media seeking request events being dispatched.
     *
     * @type {number}
     */
    this.seekingRequestThrottle = 100;

    // State
    /**
     * @protected
     * @type {number}
     */
    this.currentTimePercentage = 0;

    /**
     * @protected
     * @type {boolean}
     */
    this.isDraggingThumb = false;

    // Context Consumers
    /**
     * @protected
     * @type {number}
     */
    this.mediaCurrentTime = mediaContext.currentTime.initialValue;

    /**
     * @protected
     * @type {number}
     */
    this.mediaDuration = 0;

    /**
     * @protected
     * @type {boolean}
     */
    this.mediaPaused = mediaContext.paused.initialValue;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      hidden: { type: Boolean, reflect: true },
      label: { attribute: 'label', reflect: true },
      orientation: { reflect: true },
      pauseWhileDragging: { type: Boolean, attribute: 'pause-while-dragging' },
      valueText: { attribute: 'value-text' },
      keyboardStep: { type: Number, attribute: 'keyboard-step' },
      shiftKeyMultiplier: { type: Number, attribute: 'shift-key-multiplier' },
      seekingRequestThrottle: {
        type: Number,
        attribute: 'seeking-request-throttle'
      },
      // State
      isDraggingThumb: { state: true },
      currentTimePercentage: { state: true }
    };
  }

  /** @type {import('../../../foundation/context').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      mediaCurrentTime: mediaContext.currentTime,
      mediaDuration: {
        context: mediaContext.duration,
        transform: (d) => (d >= 0 ? d : 0)
      },
      mediaPaused: mediaContext.paused
    };
  }

  /**
   * The current media time.
   *
   * @type {number}
   */
  get currentTime() {
    if (this.mediaDuration <= 0) return 0;
    return this.mediaDuration * (this.currentTimePercentage / 100);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (
      changedProperties.has('mediaCurrentTime') ||
      changedProperties.has('mediaDuration')
    ) {
      this.updateCurrentTime();
    }

    if (
      changedProperties.has('mediaDuration') ||
      changedProperties.has('step') ||
      changedProperties.has('keyboardStep')
    ) {
      this.updateSteps();
    }

    if (changedProperties.has('seekingRequestThrottle')) {
      this.dispatchSeekingRequest.updateDelay(this.seekingRequestThrottle);
    }

    if (changedProperties.has('disabled') && this.disabled) {
      this.dispatchSeekingRequest.cancel();
    }

    super.update(changedProperties);
  }

  disconnectedCallback() {
    this.dispatchSeekingRequest.cancel();
    super.disconnectedCallback();
  }

  render() {
    return html`${this.renderSlider()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Slider
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<SliderElement>}
   */
  sliderRef = createRef();

  /**
   * Returns the underlying `vds-slider` component.
   *
   * @type {SliderElement}
   */
  get sliderElement() {
    return /** @type {SliderElement} */ (this.sliderRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderSlider() {
    const valueNow = this.mediaDuration * (this.currentTimePercentage / 100);

    return html`
      <vds-slider
        id="slider"
        label=${ifNonEmpty(this.label)}
        min="0"
        max="100"
        value=${this.currentTimePercentage}
        step=${this.stepSeconds}
        keyboard-step=${this.keyboardStepSeconds}
        shift-key-multiplier=${this.shiftKeyMultiplier}
        part=${this.getSliderPartAttr()}
        orientation=${this.orientation}
        value-min=${0}
        value-now=${Math.round(valueNow)}
        value-max=${Math.round(this.mediaDuration)}
        value-text=${this.getSliderProgressText()}
        exportparts=${this.getSliderExportPartsAttr()}
        ?hidden=${this.hidden}
        ?disabled=${this.disabled}
        ${on(SliderValueChangeEvent.TYPE, this.handleSliderValueChange)}
        ${on(SliderDragStartEvent.TYPE, this.handleSliderDragStart)}
        ${on(SliderDragEndEvent.TYPE, this.handleSliderDragEnd)}
        ${forwardEvent(SliderValueChangeEvent.TYPE)}
        ${forwardEvent(SliderDragStartEvent.TYPE)}
        ${forwardEvent(SliderDragEndEvent.TYPE)}
        ${ref(this.sliderRef)}
      >
        ${this.renderSliderChildren()}
      </vds-slider>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getSliderPartAttr() {
    return 'slider';
  }

  /**
   * @protected
   * @returns {string}
   */
  getSliderExportPartsAttr() {
    return buildExportPartsAttr(SliderElement.parts, 'slider');
  }

  /**
   * @protected
   * @returns {string}
   */
  getSliderProgressText() {
    const currentTime = this.mediaDuration * (this.currentTimePercentage / 100);

    return this.valueText
      .replace('{currentTime}', formatSpokenTime(currentTime))
      .replace('{duration}', formatSpokenTime(this.mediaDuration));
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderSliderChildren() {
    return this.renderSliderSlot();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderSliderSlot() {
    return html`<slot name=${ifNonEmpty(this.getSliderSlotName())}></slot>`;
  }

  /**
   * @protected
   * @returns {string | undefined}
   */
  getSliderSlotName() {
    return undefined;
  }

  /**
   * @protected
   * @param {SliderDragStartEvent} event
   * @returns {Promise<void>}
   */
  async handleSliderDragStart(event) {
    this.isDraggingThumb = true;
    this.setAttribute('dragging', '');
    this.togglePlaybackWhileDragging(event);
  }

  /**
   * @protected
   * @param {SliderValueChangeEvent} event
   * @returns {Promise<void>}
   */
  async handleSliderValueChange(event) {
    this.currentTimePercentage = event.detail;

    if (this.isDraggingThumb) {
      this.dispatchSeekingRequest(event);
    }

    if (!isPointerEvent(event.originalEvent)) {
      this.dispatchSeekingRequest.cancel();
      this.remoteControl.seek(this.currentTime, event);
    }
  }

  /**
   * @protected
   * @param {SliderDragEndEvent} event
   * @returns {Promise<void>}
   */
  async handleSliderDragEnd(event) {
    this.isDraggingThumb = false;
    this.removeAttribute('dragging');
    this.dispatchSeekingRequest.cancel();
    this.remoteControl.seek(this.currentTime, event);
    this.togglePlaybackWhileDragging(event);
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('../../../utils/timing').ThrottledFunction<(event: Event) => void>}
   */
  dispatchSeekingRequest = throttle((event) => {
    this.remoteControl.seeking(this.currentTime, event);
  }, this.seekingRequestThrottle);

  /**
   * @protected
   */
  updateCurrentTime() {
    if (this.isDraggingThumb) return;

    const percentage =
      this.mediaDuration > 0
        ? (this.mediaCurrentTime / this.mediaDuration) * 100
        : 0;

    this.currentTimePercentage = clampNumber(0, round(percentage, 5), 100);
  }

  /**
   * @protected
   * @type {number}
   */
  stepSeconds = this.step;

  /**
   * @protected
   * @type {number}
   */
  keyboardStepSeconds = this.step * this.keyboardStep;

  /**
   * @protected
   */
  updateSteps() {
    this.stepSeconds =
      this.mediaDuration > 0
        ? round((this.step / this.mediaDuration) * 100, 2)
        : this.step;

    this.keyboardStepSeconds = this.stepSeconds * this.keyboardStep;
  }

  /**
   * @protected
   * @type {boolean}
   */
  wasPlayingBeforeDragStart = false;

  /**
   * @protected
   * @param {Event} event
   */
  togglePlaybackWhileDragging(event) {
    if (!this.pauseWhileDragging) return;

    if (this.isDraggingThumb && !this.mediaPaused) {
      this.wasPlayingBeforeDragStart = true;
      this.remoteControl.pause(event);
    } else if (
      this.wasPlayingBeforeDragStart &&
      !this.isDraggingThumb &&
      this.mediaPaused
    ) {
      this.wasPlayingBeforeDragStart = false;
      this.remoteControl.play(event);
    }
  }
}

export const TIME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  disabled: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.disabled,
  hidden: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.hidden,
  keyboardStep: { control: StorybookControlType.Number, defaultValue: 20 },
  label: {
    control: StorybookControlType.Text,
    defaultValue: 'Media time slider'
  },
  orientation: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.orientation,
  pauseWhileDragging: { control: StorybookControlType.Boolean },
  seekingRequestThrottle: {
    control: StorybookControlType.Number,
    defaultValue: 100
  },
  shiftKeyMultiplier: { control: StorybookControlType.Number, defaultValue: 2 },
  step: { control: StorybookControlType.Number, defaultValue: 0.25 },
  valueText: {
    control: StorybookControlType.Text,
    defaultValue: '{currentTime} out of {duration}'
  },
  // Media Properties
  mediaCurrentTime: {
    control: StorybookControlType.Number,
    defaultValue: 1800
  },
  mediaDuration: {
    control: StorybookControlType.Number,
    defaultValue: 3600
  },
  mediaPaused: {
    control: StorybookControlType.Boolean,
    defaultValue: true
  },
  // Media Request Actions
  onPlayRequest: storybookAction(PlayRequestEvent.TYPE),
  onPauseRequest: storybookAction(PauseRequestEvent.TYPE),
  onSeekingRequest: storybookAction(SeekingRequestEvent.TYPE),
  onSeekRequest: storybookAction(SeekRequestEvent.TYPE)
};
