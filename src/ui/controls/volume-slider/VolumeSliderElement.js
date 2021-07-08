// ** Dependencies **
import '../slider/define.js';

import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { ifNonEmpty } from '../../../foundation/directives/index.js';
import { VdsElement } from '../../../foundation/elements/index.js';
import {
  storybookAction,
  StorybookControlType
} from '../../../foundation/storybook/index.js';
import { mediaContext } from '../../../media/context.js';
import {
  MediaRemoteControl,
  VolumeChangeRequestEvent
} from '../../../media/index.js';
import { round } from '../../../utils/number.js';
import {
  SLIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderElement,
  SliderValueChangeEvent
} from '../slider/index.js';
import { volumeSliderElementStyles } from './styles.js';

export const VOLUME_SLIDER_ELEMENT_TAG_NAME = 'vds-volume-slider';

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @tagname vds-volume-slider
 * @slot Used to pass content into the root.
 * @slot slider - Used to pass content into the slider component (`<vds-slider>`).
 * @csspart root - The component's root element (`<div>`).
 * @csspart slider - The slider component (`<vds-slider>`).
 * @csspart slider-* - All slider parts re-exported with the `slider` prefix such as `slider-root` and `slider-thumb`.
 *  @example
 * ```html
 * <vds-volume-slider label="Volume slider"></vds-volume-slider>
 * ```
 */
export class VolumeSliderElement extends VdsElement {
  /** @type {import('lit').CSSResultGroup} */
  static get styles() {
    return [volumeSliderElementStyles];
  }

  /** @type {string[]} */
  static get parts() {
    const sliderExportParts = SliderElement.parts.map(
      (part) => `slider-${part}`
    );
    return ['root', 'slider', ...sliderExportParts];
  }

  constructor() {
    super();

    // Properties
    /**
     * Whether the slider is disabled.
     *
     * @type {boolean}
     */
    this.disabled = false;

    /**
     * Whether the slider is hidden.
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
     * ♿ **ARIA:** The `aria-label` for the slider.
     *
     * @type {string}
     */
    this.label = 'Volume slider';

    /**
     * A number that specifies the granularity that the slider value must adhere to.
     *
     * @type {number}
     */
    this.step = 0.5;

    /**
     * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
     * the slider via keyboard.
     *
     * @type {number}
     */
    this.keyboardStep = 0.5;

    /**
     * A number that will be used to multiply the `step` when the `Shift` key is held down and the
     * slider value is changed by pressing `LeftArrow` or `RightArrow`.
     *
     * @type {number}
     */
    this.shiftKeyMultiplier = 10;

    // Context
    /**
     * @protected
     * @type {number}
     */
    this.mediaVolume = mediaContext.volume.initialValue;

    // State
    /**
     * @protected
     * @type {number}
     */
    this.currentVolume = this.mediaVolume * 100;
  }

  // -------------------------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------------------------

  /** @type {import('lit').PropertyDeclarations} */
  static get properties() {
    return {
      // Properties
      disabled: { type: Boolean, reflect: true },
      hidden: { type: Boolean, reflect: true },
      orientation: { reflect: true },
      label: { reflect: true },
      step: { type: Number, reflect: true },
      keyboardStep: { type: Number, attribute: 'keyboard-step' },
      shiftKeyMultiplier: {
        type: Number,
        attribute: 'shift-key-multiplier'
      },
      currentVolume: { state: true }
    };
  }

  /** @type {import('../../../foundation/context/types').ContextConsumerDeclarations} */
  static get contextConsumers() {
    return {
      mediaVolume: mediaContext.volume
    };
  }

  /**
   * The current volume level.
   *
   * @type {number}
   */
  get volume() {
    return round(this.currentVolume / 100, 3);
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @param {import('lit').PropertyValues} changedProperties
   */
  update(changedProperties) {
    super.update(changedProperties);

    if (changedProperties.has('mediaVolume')) {
      this.currentVolume = this.mediaVolume * 100;
    }
  }

  render() {
    return this.renderVolumeSlider();
  }

  // -------------------------------------------------------------------------------------------
  // Render (Volume Slider)
  // -------------------------------------------------------------------------------------------

  /**
   * @protected
   * @readonly
   * @type {import('lit/directives/ref').Ref<HTMLDivElement>}
   */
  rootRef = createRef();

  /**
   * The component's root element.
   *
   * @type {HTMLDivElement}
   */
  get rootElement() {
    return /** @type {HTMLDivElement} */ (this.rootRef.value);
  }

  renderVolumeSlider() {
    return html`
      <div
        id="root"
        part=${this.getVolumeSliderPartAttr()}
        ?hidden=${this.hidden}
        ${ref(this.rootRef)}
      >
        ${this.renderSlider()}${this.renderDefaultSlot()}
      </div>
    `;
  }

  /**
   * @protected
   * @returns {string}
   */
  getVolumeSliderPartAttr() {
    return 'root';
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderDefaultSlot() {
    return html`<slot></slot>`;
  }

  // -------------------------------------------------------------------------------------------
  // Render (Slider)
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
    return html`
      <vds-slider
        id="slider"
        exportparts=${this.getSliderExportPartsAttr()}
        label=${ifNonEmpty(this.label)}
        min="0"
        max="100"
        orientation=${this.orientation}
        part=${this.getSliderPartAttr()}
        step=${this.step}
        keyboard-step=${this.keyboardStep}
        shift-key-multiplier=${this.shiftKeyMultiplier}
        throttle=${0}
        value=${this.currentVolume}
        ?disabled=${this.disabled}
        ?hidden=${this.hidden}
        @vds-slider-drag-start=${this.handleSliderDragStart}
        @vds-slider-drag-end=${this.handleSliderDragEnd}
        @vds-slider-value-change=${this.handleSliderValueChange}
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
    // Take all slider parts and re-export with `slider` prefix (eg: `root` => `slider-root`).
    return SliderElement.parts
      .map((part) => `${part}: slider-${part}`)
      .join(', ');
  }

  /**
   * @protected
   * @returns {import('lit').TemplateResult}
   */
  renderSliderChildren() {
    return html`<slot name="slider"></slot>`;
  }

  /**
   * @protected
   * @readonly
   */
  remoteControl = new MediaRemoteControl(this);

  /**
   * @protected
   * @param {SliderDragStartEvent} event
   */
  handleSliderDragStart(event) {
    this.setAttribute('dragging', '');
  }

  /**
   * @protected
   * @param {SliderDragEndEvent} event
   */
  handleSliderDragEnd(event) {
    this.removeAttribute('dragging');
  }

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
    control: StorybookControlType.Text,
    defaultValue: 'Volume slider'
  },
  step: {
    control: StorybookControlType.Number,
    defaultValue: 0.5
  },
  keyboardStep: {
    control: StorybookControlType.Number,
    defaultValue: 0.5
  },
  shiftKeyMultiplier: {
    control: StorybookControlType.Number,
    defaultValue: 10
  },
  // Media Properties
  mediaVolume: {
    control: {
      type: StorybookControlType.Number,
      step: 0.05
    },
    defaultValue: 0.5
  },
  // Media Request Actions
  onVolumeChangeRequest: storybookAction(VolumeChangeRequestEvent.TYPE)
};
