import {
  eventListener,
  formatSpokenTime,
  isKeyboardEvent,
  setAttributeIfEmpty,
  throttle,
} from '@vidstack/foundation';
import { type CSSResultGroup, type PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { mediaStoreSubscription } from '../../media';
import { SliderElement } from '../slider';
import { timeSliderElementStyles } from './styles';

/**
 * A slider that lets the user control the current media playback time.
 *
 * @tagname vds-time-slider
 * @example
 * ```html
 * <vds-time-slider>
 *   <div class="thumb"></div>
 * </vds-time-slider>
 * ```
 */
export class TimeSliderElement extends SliderElement {
  static override get styles(): CSSResultGroup {
    return [super.styles, timeSliderElementStyles];
  }

  constructor() {
    super();

    mediaStoreSubscription(this, 'currentTime', ($currentTime) => {
      this.value = $currentTime;
    });
    mediaStoreSubscription(this, 'duration', ($duration) => {
      this.__mediaDuration = $duration;
      this.requestUpdate('max');
    });
    mediaStoreSubscription(this, 'paused', ($paused) => {
      this.__mediaPaused = $paused;
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Media time');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  protected override _step = 0.1;

  /**
   * Represents the current media playback time.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  override value = 0;

  /** @internal */
  @property({ attribute: false })
  override get min() {
    return 0;
  }
  override set min(_) {}

  /** @internal */
  @property({ attribute: false })
  override get max() {
    return this.__mediaDuration;
  }
  override set max(_) {}

  /**
   * ♿ **ARIA:** Human-readable text alternative for the current slider value. If you pass
   * in a string containing `{currentTime}` or `{duration}` templates they'll be replaced with
   * the spoken form such as `1 hour 30 minutes`.
   */
  @property({ attribute: 'value-text' })
  valueText = '{currentTime} out of {duration}';

  /**
   * Whether it should request playback to pause while the user is dragging the
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

  @state() protected __mediaDuration = 0;
  @state() protected __mediaPaused = true;

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
  // ARIA
  // -------------------------------------------------------------------------------------------

  protected override _getValueMin(): string {
    return '0%';
  }

  protected override _getValueNow(): string {
    return `${Math.round(this.fillPercent)}%`;
  }

  protected override _getValueText(): string {
    return this.valueText
      .replace('{currentTime}', formatSpokenTime(this.value))
      .replace('{duration}', formatSpokenTime(this.__mediaDuration));
  }

  protected override _getValueMax(): string {
    return '100%';
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  protected readonly _handleSliderDragStart = eventListener(
    this,
    'vds-slider-drag-start',
    (event) => {
      this._togglePlaybackWhileDragging(event);
    },
  );

  protected readonly _handleSliderValueChange = eventListener(
    this,
    'vds-slider-value-change',
    (event) => {
      if (isKeyboardEvent(event.originEvent)) {
        this._dispatchSeekingRequest.cancel();
        this._mediaRemote.seek(this.value, event);
      }
    },
  );

  protected readonly _handleSliderDragValueChange = eventListener(
    this,
    'vds-slider-drag-value-change',
    (event) => {
      this._dispatchSeekingRequest(event);
    },
  );

  protected readonly _handleSliderDragEnd = eventListener(this, 'vds-slider-drag-end', (event) => {
    this._dispatchSeekingRequest.cancel();
    this._mediaRemote.seek(this.value, event);
    this._togglePlaybackWhileDragging(event);
  });

  protected readonly _dispatchSeekingRequest = throttle((event: Event) => {
    this._mediaRemote.seeking(this.value, event);
  }, this.seekingRequestThrottle);

  protected _wasPlayingBeforeDragStart = false;
  protected _togglePlaybackWhileDragging(event: Event) {
    if (!this.pauseWhileDragging) return;

    if (this.isDragging && !this.__mediaPaused) {
      this._wasPlayingBeforeDragStart = true;
      this._mediaRemote.pause(event);
    } else if (this._wasPlayingBeforeDragStart && !this.isDragging && this.__mediaPaused) {
      this._wasPlayingBeforeDragStart = false;
      this._mediaRemote.play(event);
    }
  }
}
