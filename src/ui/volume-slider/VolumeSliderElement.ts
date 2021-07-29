import { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { consumeContext, watchContext } from '../../base/context';
import { eventListener } from '../../base/events';
import { mediaContext, MediaRemoteControl } from '../../media';
import { setAttribute } from '../../utils/dom';
import { round } from '../../utils/number';
import { SliderElement, SliderValueChangeEvent } from '../slider';

export const VOLUME_SLIDER_ELEMENT_TAG_NAME = 'vds-volume-slider';

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * 💡 The following attributes are updated for your styling needs:
 *
 * - `media-can-play`: Applied when media can begin playback.
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

  override label = 'Media volume slider';
  override step = 0.5;
  override keyboardStep = 0.5;
  override shiftKeyMultiplier = 10;

  /** @internal */
  @property({ attribute: false })
  override min = 0;
  /** @internal */
  @property({ attribute: false })
  override max = 100;

  @consumeContext(mediaContext.volume)
  protected _mediaVolume = mediaContext.volume.initialValue;

  /**
   * Represents the current volume out of 100.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  override value = this._mediaVolume * 100;

  /**
   * The current media volume level (between 0 - 1).
   */
  get volume() {
    return round(this.value / 100, 3);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  protected override update(changedProperties: PropertyValues) {
    if (changedProperties.has('_mediaVolume')) {
      this.value = this._mediaVolume * 100;
    }

    super.update(changedProperties);
  }

  // -------------------------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------------------------

  @watchContext(mediaContext.canPlay)
  protected _handleCanPlayContextUpdate(canPlay: boolean) {
    setAttribute(this, 'media-can-play', canPlay);
  }

  protected readonly _mediaRemote = new MediaRemoteControl(this);

  @eventListener('vds-slider-value-change')
  protected _handleSliderValueChange(event: SliderValueChangeEvent) {
    const newVolume = event.detail;
    const mediaVolume = round(newVolume / 100, 3);
    this._mediaRemote.changeVolume(mediaVolume, event);
  }
}
