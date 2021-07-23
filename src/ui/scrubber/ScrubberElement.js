// ** Dependencies **
import '../time-slider/define.js';

import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { provideContextRecord } from '../../foundation/context/index.js';
import {
  forwardEvent,
  ifNonEmpty,
  on
} from '../../foundation/directives/index.js';
import { WithFocus } from '../../foundation/elements/index.js';
import { eventListener } from '../../foundation/events/index.js';
import { buildExportPartsAttr } from '../../utils/dom.js';
import { isNil } from '../../utils/unit.js';
import { ScrubberPreviewElement } from '../scrubber-preview/index.js';
import { SeekableProgressBarElement } from '../seekable-progress-bar/index.js';
import { TimeSliderElement } from '../time-slider/index.js';
import { scrubberContext } from './context.js';
import { scrubberElementStyles } from './styles.js';

export const SCRUBBER_ELEMENT_TAG_NAME = 'vds-scrubber';

/**
 * A control that displays the progression of playback and the amount seekable on a slider. This
 * control can be used to update the current playback time by interacting with the slider.
 *
 * 💡 See the `<vds-scrubber-preview>` element if you'd like to include previews.
 *
 * @tagname vds-scrubber
 * @csspart time-slider - The time slider (`<vds-time-slider>`).
 * @csspart time-slider-* - All `vds-time-slider` parts re-exported with the `time-slider` prefix.
 * @csspart progress-bar - The progress bar (`<vds-seekable-progress-bar>`).
 * @csspart progress-bar-* - All `vds-seekable-progress-bar` parts re-exported with the `progress-bar` prefix.
 * @slot Used to pass content into the slider.
 * @slot progress-bar - Used to pass content into the progress bar.
 */
export class ScrubberElement extends WithFocus(LitElement) {
  /**
   * @type {import('lit').CSSResultGroup}
   */
  static get styles() {
    return [scrubberElementStyles];
  }

  /**
   * @type {string[]}
   */
  static get parts() {
    const timeSliderExports = TimeSliderElement.parts.map(
      (part) => `time-slider-${part}`
    );

    const seekableProgressBarExports = SeekableProgressBarElement.parts.map(
      (part) => `progress-bar-${part}`
    );

    return [
      'time-slider',
      'progress-bar',
      ...timeSliderExports,
      ...seekableProgressBarExports
    ];
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   */
  ctx = provideContextRecord(this, scrubberContext);

  /**
   * Whether the scrubber should be disabled (not-interactable).
   *
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the scrubber should be hidden.
   *
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  hidden = false;

  /**
   * ♿ **ARIA:** The `aria-label` for the time slider.
   *
   * @type {string}
   */
  @property({ reflect: true })
  label = 'Media time slider';

  /**
   * The time slider orientation.
   *
   * @type {'horizontal' | 'vertical'}
   */
  @property({ reflect: true })
  orientation = 'horizontal';

  /**
   * ♿ **ARIA:** The `aria-label` for the progress bar.
   *
   * @type {string}
   */
  @property({ attribute: 'progress-label', reflect: true })
  progressLabel = 'Amount of seekable media';

  /**
   * ♿ **ARIA:** Human-readable text alternative for the progress bar value. If you pass
   * in a string containing `{seekableAmount}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   *
   * @type {string}
   */
  @property({ attribute: 'progress-value-text' })
  progressValueText = '{seekableAmount} out of {duration}';

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
   * A number that specifies the granularity that the time slider value must adhere to in seconds.
   * For example, a step with the value `1` indicates a granularity of 1 second increments.
   *
   * @type {number}
   */
  @property({ type: Number })
  step = 0.25;

  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the time slider via keyboard. Think of it as `step * keyboardStep`.
   *
   * @type {number}
   */
  @property({ attribute: 'keyboard-step', type: Number })
  keyboardStep = 20;

  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyboardStep * shiftKeyMultiplier`.
   *
   * @type {number}
   */
  @property({ attribute: 'shift-key-multiplier', type: Number })
  shiftKeyMultiplier = 2;

  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   *
   * @type {number}
   */
  @property({ attribute: 'seeking-request-throttle', type: Number })
  seekingRequestThrottle = 100;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the time slider value. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   *
   * @type {string}
   */
  @property({ attribute: 'value-tex' })
  valueText = '{currentTime} out of {duration}';

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this.scrubberPreviewElement?.hidePreview();
      }

      if (!isNil(this.scrubberPreviewElement)) {
        this.scrubberPreviewElement.disabled = this.disabled;
      }
    }

    if (changedProperties.has('hidden')) {
      if (!isNil(this.scrubberPreviewElement)) {
        this.scrubberPreviewElement.hidden = this.hidden;
      }
    }

    super.update(changedProperties);
  }

  render() {
    return html`${this._renderTimeSlider()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Pointer Events
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {PointerEvent} event
   */
  @eventListener('pointerenter')
  _handlePointerEnter(event) {
    if (this.disabled) return;
    this.ctx.pointing = true;
    this.setAttribute('pointing', '');
    this.scrubberPreviewElement?.showPreview(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  @eventListener('pointermove')
  _handlePointerMove(event) {
    if (this.disabled || this.ctx.dragging) return;
    this.scrubberPreviewElement?.updatePreviewPosition(event);
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  @eventListener('pointerleave')
  _handlePointerLeave(event) {
    if (this.disabled) return;

    this.ctx.pointing = false;
    this.removeAttribute('pointing');

    if (!this.ctx.dragging) {
      this.scrubberPreviewElement?.hidePreview(event);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Time Slider
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<TimeSliderElement>}
   */
  _timeSliderRef = createRef();

  /**
   * Returns the underlying `vds-time-slider` component.
   *
   * @type {TimeSliderElement}
   */
  get timeSliderElement() {
    return /** @type {TimeSliderElement} */ (this._timeSliderRef.value);
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTimeSlider() {
    return html`
      <vds-time-slider
        id="time-slider"
        exportparts=${buildExportPartsAttr(
          TimeSliderElement.parts,
          'time-slider'
        )}
        label=${ifNonEmpty(this.label)}
        orientation=${this.orientation}
        part="time-slider"
        step=${this.step}
        keyboard-step=${this.keyboardStep}
        shift-key-multiplier=${this.shiftKeyMultiplier}
        value-text=${this.valueText}
        ?disabled=${this.disabled}
        ?hidden=${this.hidden}
        ${on('vds-slider-drag-start', this._handleSliderDragStart)}
        ${on('vds-slider-value-change', this._handleSliderValueChange)}
        ${on('vds-slider-drag-end', this._handleSliderDragEnd)}
        ${forwardEvent('vds-slider-drag-start')}
        ${forwardEvent('vds-slider-value-change')}
        ${forwardEvent('vds-slider-drag-end')}
        ${ref(this._timeSliderRef)}
      >
        ${this._renderTimeSliderChildren()}
      </vds-time-slider>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderTimeSliderChildren() {
    return html`${this._renderDefaultSlot()}${this._renderProgressBar()}`;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  /**
   * @protected
   * @param {import('../slider').SliderDragStartEvent} event
   */
  _handleSliderDragStart(event) {
    if (this.disabled) return;
    this.ctx.dragging = true;
    this.setAttribute('dragging', '');
    this.scrubberPreviewElement?.showPreview(event);
  }

  /**
   * @protected
   * @param {import('../slider').SliderValueChangeEvent} event
   */
  _handleSliderValueChange(event) {
    if (this.disabled) return;
    this.scrubberPreviewElement?.updatePreviewPosition(event);
  }

  /**
   * @protected
   * @param {import('../slider').SliderDragEndEvent} event
   */
  _handleSliderDragEnd(event) {
    if (this.disabled) return;
    this.ctx.dragging = false;
    this.removeAttribute('dragging');
    this.scrubberPreviewElement?.hidePreview(event);
  }

  // -------------------------------------------------------------------------------------------
  // Seekable Progress Bar
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<SeekableProgressBarElement>}
   */
  _progressBarRef = createRef();

  /**
   * Returns the underlying `<vds-seekable-progress-bar>` component.
   *
   * @type {SeekableProgressBarElement}
   */
  get progressBarElement() {
    return /** @type {SeekableProgressBarElement} */ (
      this._progressBarRef.value
    );
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderProgressBar() {
    return html`
      <vds-seekable-progress-bar
        id="progress-bar"
        part="progress-bar"
        exportparts=${buildExportPartsAttr(
          SeekableProgressBarElement.parts,
          'progress-bar'
        )}
        label=${this.progressLabel}
        value-text=${this.progressValueText}
        ${ref(this._progressBarRef)}
      >
        ${this._renderProgressBarChildren()}
      </vds-seekable-progress-bar>
    `;
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderProgressBarChildren() {
    return this._renderProgressBarSlot();
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  _renderProgressBarSlot() {
    return html`<slot name="progress-bar"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Scrubber Preview
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @type {ScrubberPreviewElement | undefined}
   */
  _scrubberPreviewElement;

  /**
   * The scrubber preview element `<vds-scrubber-preview>` (if given).
   *
   * @type {ScrubberPreviewElement | undefined}
   */
  get scrubberPreviewElement() {
    return this._scrubberPreviewElement;
  }

  /**
   * @protected
   * @param {import('../scrubber-preview').ScrubberPreviewConnectEvent} event
   */
  @eventListener('vds-scrubber-preview-connect')
  _handlePreviewConnect(event) {
    event.stopPropagation();

    const { element, onDisconnect } = event.detail;

    this._scrubberPreviewElement = element;
    this.setAttribute('previewable', '');

    onDisconnect(() => {
      this._scrubberPreviewElement = undefined;
      this.removeAttribute('previewable');
    });
  }

  /**
   * @protected
   * @param {import('../scrubber-preview').ScrubberPreviewShowEvent} event
   */
  @eventListener('vds-scrubber-preview-show')
  _handlePreviewShow(event) {
    event.stopPropagation();
    this.setAttribute('previewing', '');
  }

  /**
   * @protected
   * @param {import('../scrubber-preview').ScrubberPreviewTimeUpdateEvent} event
   */
  @eventListener('vds-scrubber-preview-time-update')
  _handlePreviewTimeUpdate(event) {
    event.stopPropagation();
  }

  /**
   * @protected
   * @param {import('../scrubber-preview').ScrubberPreviewHideEvent} event
   */
  @eventListener('vds-scrubber-preview-hide')
  _handlePreviewHide(event) {
    event.stopPropagation();
    this.removeAttribute('previewing');
  }
}
