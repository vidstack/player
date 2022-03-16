import { eventListener, round, setAttributeIfEmpty, VdsEvent } from '@vidstack/foundation';
import { property } from 'lit/decorators.js';

import { mediaStoreSubscription } from '../../media';
import { SliderElement } from '../slider';

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @tagname vds-volume-slider
 *  @example
 * ```html
 * <vds-volume-slider>
 *   <div class="thumb"></div>
 * </vds-volume-slider>
 * ```
 */
export class VolumeSliderElement extends SliderElement {
  constructor() {
    super();

    mediaStoreSubscription(this, 'volume', ($volume) => {
      this.value = $volume * 100;
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    setAttributeIfEmpty(this, 'aria-label', 'Media volume');
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @internal */
  @property({ attribute: false })
  override get min() {
    return 0;
  }
  override set min(_) {}

  /** @internal */
  @property({ attribute: false })
  override get max() {
    return 100;
  }
  override set max(_) {}

  /**
   * Represents the current volume out of 100.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  override value = 100;

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  // Need this event for keyboard support.
  protected readonly _handleSliderValueChange = eventListener(
    this,
    'vds-slider-value-change',
    this._changeVolume.bind(this),
  );

  protected readonly _handleSliderDragValueChange = eventListener(
    this,
    'vds-slider-drag-value-change',
    this._changeVolume.bind(this),
  );

  protected _changeVolume(event: VdsEvent<number>) {
    const newVolume = event.detail;
    const mediaVolume = round(newVolume / 100, 3);
    this._mediaRemote.changeVolume(mediaVolume, event);
  }
}
