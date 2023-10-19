import {
  effect,
  hasProvidedContext,
  peek,
  provideContext,
  signal,
  ViewController,
} from 'maverick.js';
import { animationFrameThrottle, ariaBool } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { FocusVisibleController } from '../../../../foundation/observers/focus-visible';
import { setAttributeIfEmpty } from '../../../../utils/dom';
import { round } from '../../../../utils/number';
import type { SliderEvents } from './api/events';
import type { SliderState } from './api/state';
import { SliderEventsController, type SliderEventDelegate } from './events-controller';
import { sliderValueFormatContext } from './format';
import { sliderContext } from './slider-context';
import type { SliderOrientation } from './types';
import { getClampedValue } from './utils';

export interface SliderDelegate extends Omit<SliderEventDelegate, '_getOrientation'> {
  _getARIAValueNow(): number;
  _getARIAValueText(): string;
}

export class SliderController extends ViewController<
  SliderControllerProps,
  SliderState,
  SliderEvents
> {
  static props: SliderControllerProps = {
    disabled: false,
    step: 1,
    keyStep: 1,
    orientation: 'horizontal',
    shiftKeyMultiplier: 5,
  };

  private _media!: MediaContext;

  constructor(private _delegate: SliderDelegate) {
    super();
  }

  protected override onSetup(): void {
    this._media = useMediaContext();

    const focus = new FocusVisibleController();
    focus.attach(this);
    // @ts-expect-error - overwrite readonly
    this.$state.focused = focus.focused.bind(focus);

    if (!hasProvidedContext(sliderValueFormatContext)) {
      provideContext(sliderValueFormatContext, {
        default: 'value',
      });
    }

    provideContext(sliderContext, {
      _orientation: this.$props.orientation,
      _disabled: this._delegate._isDisabled,
      _preview: signal<HTMLElement | null>(null),
    });

    effect(this._watchValue.bind(this));
    effect(this._watchDisabled.bind(this));

    this._setupAttrs();

    new SliderEventsController(this._delegate, this._media).attach(this);
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'role', 'slider');
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'autocomplete', 'off');
    if (__SERVER__) this._watchCSSVars();
    else effect(this._watchCSSVars.bind(this));
  }

  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------

  private _watchValue() {
    const { dragging, value, min, max } = this.$state;
    if (peek(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this._delegate._getStep()));
  }

  private _watchDisabled() {
    if (!this._delegate._isDisabled()) return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  private _getARIADisabled() {
    return ariaBool(this._delegate._isDisabled());
  }

  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------

  private _setupAttrs() {
    const { orientation } = this.$props,
      { dragging, active, pointing } = this.$state;

    this.setAttributes({
      'data-dragging': dragging,
      'data-pointing': pointing,
      'data-active': active,
      'aria-disabled': this._getARIADisabled.bind(this),
      'aria-valuemin': this.$state.min,
      'aria-valuemax': this.$state.max,
      'aria-valuenow': this._delegate._getARIAValueNow,
      'aria-valuetext': this._delegate._getARIAValueText,
      'aria-orientation': orientation,
    });
  }

  private _watchCSSVars() {
    const { fillPercent, pointerPercent } = this.$state;
    this._updateSliderVars(round(fillPercent(), 3), round(pointerPercent(), 3));
  }

  private _updateSliderVars = animationFrameThrottle(
    (fillPercent: number, pointerPercent: number) => {
      this.el?.style.setProperty('--slider-fill', fillPercent + '%');
      this.el?.style.setProperty('--slider-pointer', pointerPercent + '%');
    },
  );
}

export interface SliderControllerProps {
  /**
   * Whether the slider should be disabled (non-interactive).
   */
  disabled: boolean;
  /**
   * The orientation of the slider.
   */
  orientation: SliderOrientation;
  /**
   * A number that specifies the granularity that the slider value must adhere to.
   *
   * A step is an abstract unit that may carry a different type of measure depending on the type of
   * slider. For example, for the volume slider each step is 1% of volume, and for the time slider
   * it is 1 second which is a varying percentage depending on the media duration.
   */
  step: number;
  /**
   * ♿ **ARIA:** A number that specifies the number of steps taken when interacting with
   * the slider via keyboard.
   *
   * A step is an abstract unit that may carry different type of measure depending on the type of
   * slider. For example, for the volume slider each step is 1% of volume, and for the time slider
   * it is 1 second which is a varying percentage depending on the media duration.
   */
  keyStep: number;
  /**
   * ♿ **ARIA:** A number that will be used to multiply the `keyStep` when the `Shift` key
   * is held down and the slider value is changed by pressing `LeftArrow` or `RightArrow`. Think
   * of it as `keyStep * shiftKeyMultiplier`.
   */
  shiftKeyMultiplier: number;
}
