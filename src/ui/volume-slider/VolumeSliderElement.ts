import { PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';

import { hostedEventListener } from '../../base/events';
import { hostedMediaStoreSubscription, MediaRemoteControl } from '../../media';
import { setAttribute, setAttributeIfEmpty } from '../../utils/dom';
import { round } from '../../utils/number';
import { SliderElement } from '../slider';

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
  constructor() {
    super();
    hostedMediaStoreSubscription(this, 'volume', ($volume) => {
      this._mediaVolume = $volume;
    });
    hostedMediaStoreSubscription(this, 'canPlay', ($canPlay) => {
      setAttribute(this, 'media-can-play', $canPlay);
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Media volume');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  override _step = 0.5;
  override _keyboardStep = 0.5;
  override shiftKeyMultiplier = 10;

  /** @internal */
  @property({ attribute: false })
  override min = 0;
  /** @internal */
  @property({ attribute: false })
  override max = 100;

  @state() protected _mediaVolume = 1;

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

  protected readonly _mediaRemote = new MediaRemoteControl(this);

  protected readonly _handleSliderValueChange = hostedEventListener(
    this,
    'vds-slider-value-change',
    (event) => {
      const newVolume = event.detail;
      const mediaVolume = round(newVolume / 100, 3);
      this._mediaRemote.changeVolume(mediaVolume, event);
    }
  );
}
