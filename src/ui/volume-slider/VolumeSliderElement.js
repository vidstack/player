// ** Dependencies **
import '../slider/define.js';

import { property } from 'lit/decorators.js';

import { consumeContext } from '../../foundation/context/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { mediaContext } from '../../media/context.js';
import {
  MediaRemoteControl,
  VolumeChangeRequestEvent
} from '../../media/index.js';
import { round } from '../../utils/number.js';
import {
  SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  SliderElement,
  SliderValueChangeEvent
} from '../slider/index.js';

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
  mediaVolume = mediaContext.volume.initialValue;

  /**
   * Represents the current volume out of 100.
   *
   * @internal
   */
  @property({ attribute: false, state: true })
  value = this.mediaVolume * 100;

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
    if (changedProperties.has('mediaVolume')) {
      this.value = this.mediaVolume * 100;
    }

    super.update(changedProperties);
  }

  /**
   * @protected
   * @readonly
   */
  remoteControl = new MediaRemoteControl(this);

  /**
   * @protected
   * @readonly
   */
  sliderEventListenerController = new EventListenerController(this, {
    [SliderValueChangeEvent.TYPE]: this.handleSliderValueChange
  });

  /**
   * @protected
   * @param {SliderValueChangeEvent} event
   */
  handleSliderValueChange(event) {
    const newVolume = event.detail;
    this.currentVolume = newVolume;
    const mediaVolume = round(newVolume / 100, 3);
    this.remoteControl.changeVolume(mediaVolume, event);
  }
}

export const VOLUME_SLIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  disabled: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.disabled,
  hidden: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.hidden,
  orientation: SLIDER_ELEMENT_STORYBOOK_ARG_TYPES.orientation,
  label: {
    control: StorybookControl.Text,
    defaultValue: 'Volume slider'
  },
  step: {
    control: StorybookControl.Number,
    defaultValue: 0.5
  },
  keyboardStep: {
    control: StorybookControl.Number,
    defaultValue: 0.5
  },
  shiftKeyMultiplier: {
    control: StorybookControl.Number,
    defaultValue: 10
  },
  // Media Properties
  mediaVolume: {
    control: {
      type: StorybookControl.Number,
      step: 0.05
    },
    defaultValue: 0.5
  },
  // Media Request Actions
  onVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
