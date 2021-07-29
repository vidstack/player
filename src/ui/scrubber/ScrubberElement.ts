// ** Dependencies **
import '../time-slider/define';
import '../seekable-progress-bar/define';

import {
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult
} from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';

import { provideContextRecord, watchContext } from '../../base/context';
import { forwardEvent, ifNonEmpty, on } from '../../base/directives';
import { WithFocus } from '../../base/elements';
import { eventListener } from '../../base/events';
import { mediaContext } from '../../media';
import { buildExportPartsAttr, setAttribute } from '../../utils/dom';
import { isNil } from '../../utils/unit';
import {
  ScrubberPreviewConnectEvent,
  ScrubberPreviewElement,
  ScrubberPreviewHideEvent,
  ScrubberPreviewShowEvent,
  ScrubberPreviewTimeUpdateEvent
} from '../scrubber-preview';
import { SeekableProgressBarElement } from '../seekable-progress-bar';
import {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderValueChangeEvent
} from '../slider/events';
import { TimeSliderElement } from '../time-slider';
import { scrubberContext } from './context';
import { scrubberElementStyles } from './styles';

export const SCRUBBER_ELEMENT_TAG_NAME = 'vds-scrubber';

/**
 * A control that displays the progression of playback and the amount seekable on a slider. This
 * control can be used to update the current playback time by interacting with the slider.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
 * - `media-waiting`: Applied when playback has stopped because of a lack of temporary data.
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
  static override get styles(): CSSResultGroup {
    return [scrubberElementStyles];
  }

  static get parts(): string[] {
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

  protected readonly ctx = provideContextRecord(this, scrubberContext);

  /**
   * Whether the scrubber should be disabled (not-interactable).
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the scrubber should be hidden.
   */
  @property({ type: Boolean, reflect: true })
  override hidden = false;

  /**
   * ♿ **ARIA:** The `aria-label` for the time slider.
   */
  @property({ reflect: true })
  label = 'Media time slider';

  /**
   * The time slider orientation.
   */
  @property({ reflect: true })
  orientation = 'horizontal';

  /**
   * ♿ **ARIA:** The `aria-label` for the progress bar.
   */
  @property({ attribute: 'progress-label', reflect: true })
  progressLabel = 'Amount of seekable media';

  /**
   * ♿ **ARIA:** Human-readable text alternative for the progress bar value. If you pass
   * in a string containing `{seekableAmount}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   */
  @property({ attribute: 'progress-value-text' })
  progressValueText = '{seekableAmount} out of {duration}';

  /**
   * Whether the scrubber should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  @property({ attribute: 'pause-while-dragging', type: Boolean })
  pauseWhileDragging = false;

  /**
   * A number that specifies the granularity that the time slider value must adhere to in seconds.
   * For example, a step with the value `1` indicates a granularity of 1 second increments.
   */
  @property({ type: Number })
  step = 0.25;

  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the time slider via keyboard. Think of it as `step * keyboardStep`.
   */
  @property({ attribute: 'keyboard-step', type: Number })
  keyboardStep = 20;

  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyboardStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyboardStep * shiftKeyMultiplier`.
   */
  @property({ attribute: 'shift-key-multiplier', type: Number })
  shiftKeyMultiplier = 2;

  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   */
  @property({ attribute: 'seeking-request-throttle', type: Number })
  seekingRequestThrottle = 100;

  /**
   * ♿ **ARIA:** Human-readable text alternative for the time slider value. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   */
  @property({ attribute: 'value-tex' })
  valueText = '{currentTime} out of {duration}';

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: boolean) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  @watchContext(mediaContext.waiting)
  protected _handleWaitingContextUpdate(waiting: boolean) {
    setAttribute(this, 'media-waiting', waiting);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
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

  protected override render(): TemplateResult {
    return html`${this._renderTimeSlider()}`;
  }

  // -------------------------------------------------------------------------------------------
  // Pointer Events
  // -------------------------------------------------------------------------------------------

  @eventListener('pointerenter')
  protected _handlePointerEnter(event: PointerEvent) {
    if (this.disabled) return;
    this.ctx.pointing = true;
    this.setAttribute('pointing', '');
    this.scrubberPreviewElement?.showPreview(event);
  }

  @eventListener('pointermove')
  protected _handlePointerMove(event: PointerEvent) {
    if (this.disabled || this.ctx.dragging) return;
    this.scrubberPreviewElement?.updatePreviewPosition(event);
  }

  @eventListener('pointerleave')
  protected _handlePointerLeave(event: PointerEvent) {
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

  protected readonly _timeSliderRef = createRef<TimeSliderElement>();

  /**
   * Returns the underlying `vds-time-slider` component.
   */
  get timeSliderElement() {
    return this._timeSliderRef.value;
  }

  protected _renderTimeSlider(): TemplateResult {
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

  protected _renderTimeSliderChildren(): TemplateResult {
    return html`${this._renderDefaultSlot()}${this._renderProgressBar()}`;
  }

  protected _renderDefaultSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected _handleSliderDragStart(event: SliderDragStartEvent) {
    if (this.disabled) return;
    this.ctx.dragging = true;
    this.setAttribute('dragging', '');
    this.scrubberPreviewElement?.showPreview(event);
  }

  protected _handleSliderValueChange(event: SliderValueChangeEvent) {
    if (this.disabled) return;
    this.scrubberPreviewElement?.updatePreviewPosition(event);
  }

  protected _handleSliderDragEnd(event: SliderDragEndEvent) {
    if (this.disabled) return;
    this.ctx.dragging = false;
    this.removeAttribute('dragging');
    if (!this.ctx.pointing) this.scrubberPreviewElement?.hidePreview(event);
  }

  // -------------------------------------------------------------------------------------------
  // Seekable Progress Bar
  // -------------------------------------------------------------------------------------------

  protected readonly _progressBarRef = createRef<SeekableProgressBarElement>();

  /**
   * Returns the underlying `<vds-seekable-progress-bar>` component.
   */
  get progressBarElement() {
    return this._progressBarRef.value;
  }

  protected _renderProgressBar(): TemplateResult {
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

  protected _renderProgressBarChildren(): TemplateResult {
    return this._renderProgressBarSlot();
  }

  protected _renderProgressBarSlot(): TemplateResult {
    return html`<slot name="progress-bar"></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Scrubber Preview
  // -------------------------------------------------------------------------------------------

  protected _scrubberPreviewElement: ScrubberPreviewElement | undefined;

  /**
   * The scrubber preview element `<vds-scrubber-preview>` (if given).
   */
  get scrubberPreviewElement() {
    return this._scrubberPreviewElement;
  }

  @eventListener('vds-scrubber-preview-connect')
  protected _handlePreviewConnect(event: ScrubberPreviewConnectEvent) {
    event.stopPropagation();

    const { element, onDisconnect } = event.detail;

    this._scrubberPreviewElement = element;
    this.setAttribute('previewable', '');

    onDisconnect(() => {
      this._scrubberPreviewElement = undefined;
      this.removeAttribute('previewable');
    });
  }

  @eventListener('vds-scrubber-preview-show')
  protected _handlePreviewShow(event: ScrubberPreviewShowEvent) {
    event.stopPropagation();
    this.setAttribute('previewing', '');
  }

  @eventListener('vds-scrubber-preview-time-update')
  protected _handlePreviewTimeUpdate(event: ScrubberPreviewTimeUpdateEvent) {
    event.stopPropagation();
  }

  @eventListener('vds-scrubber-preview-hide')
  protected _handlePreviewHide(event: ScrubberPreviewHideEvent) {
    event.stopPropagation();
    this.removeAttribute('previewing');
  }
}
