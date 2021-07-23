// ** Dependencies **
import '../slider/define.js';

import { property } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { eventListener } from '../../foundation/events/index.js';
import { mediaContext } from '../../media/context.js';
import { MediaRemoteControl } from '../../media/index.js';
import { round } from '../../utils/number.js';
import { SliderElement } from '../slider/index.js';

export const VOLUME_SLIDER_ELEMENT_TAG_NAME = 'vds-volume-slider';

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @tagname vds-volume-slider
 *  @example
 * ```html
 * <vds-volume-slider
 *   label="Media volume slider"
 * ></vds-volume-slider>
 * ```
 * @example
 * ```css
 * vds-volume-slider {
 *   --vds-slider-track-height: 2.5px;
 *   --vds-slider-thumb-width: 16px;
 *   --vds-slider-thumb-height: 16px;
 *   --vds-slider-active-color: #ff2a5d;
 * }
 * ```
 */
export class VolumeSliderElement extends SliderElement {
  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  label = 'Media volume slider';
  step = 0.5;
  keyboardStep = 0.5;
  shiftKeyMultiplier = 10;

  /** @internal */
  @property({ attribute: false })
  min = 0;
  /** @internal */
  @property({ attribute: false })
  max = 100;

  /**
   * @protected
   * @type {number}
   */
  @consumeContext(mediaContext.volume)
  _mediaVolume = mediaContext.volume.initialValue;

  /**
   * Represents the current volume out of 100.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  value = this._mediaVolume * 100;

  /**
   * The current media volume level (between 0 - 1).
   *
   * @type {number}
   */
  get volume() {
    return round(this.value / 100, 3);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    if (changedProperties.has('_mediaVolume')) {
      this.value = this._mediaVolume * 100;
    }

    super.update(changedProperties);
  }

  /**
   * @protected
   * @readonly
   */
  _mediaRemote = new MediaRemoteControl(this);

  /**
   * @protected
   * @param {import('../slider').SliderValueChangeEvent} event
   */
  @eventListener('vds-slider-value-change')
  _handleSliderValueChange(event) {
    const newVolume = event.detail;
    this.currentVolume = newVolume;
    const mediaVolume = round(newVolume / 100, 3);
    this._mediaRemote.changeVolume(mediaVolume, event);
  }
}
