import { Component, effect } from 'maverick.js';

import { round } from '../../../../utils/number';
import type { SliderCSSVars } from './api/cssvars';
import type { SliderEvents } from './api/events';
import { sliderState, type SliderState } from './api/state';
import { SliderController, type SliderControllerProps } from './slider-controller';

/**
 * Versatile and user-friendly input control designed for seamless cross-browser compatibility and
 * accessibility with ARIA support. It offers a smooth user experience for both mouse and touch
 * interactions and is highly customizable in terms of styling. Users can effortlessly input numeric
 * values within a specified range, defined by a minimum and maximum value.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider}
 */
export class Slider extends Component<SliderProps, SliderState, SliderEvents, SliderCSSVars> {
  static props: SliderProps = {
    ...SliderController.props,
    min: 0,
    max: 100,
    value: 0,
  };

  static state = sliderState;

  constructor() {
    super();
    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this.$props.disabled,
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
    });
  }

  protected override onSetup() {
    effect(this._watchValue.bind(this));
    effect(this._watchMinMax.bind(this));
  }

  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------

  private _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }

  private _getARIAValueText() {
    const { value, max } = this.$state;
    return round((value() / max()) * 100, 2) + '%';
  }

  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------

  private _watchValue() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }

  private _watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

export interface SliderProps extends SliderControllerProps {
  /**
   * The lowest slider value in the range of permitted values.
   */
  min: number;
  /**
   * The greatest slider value in the range of permitted values.
   */
  max: number;
  /**
   * The current slider value.
   */
  value: number;
}
