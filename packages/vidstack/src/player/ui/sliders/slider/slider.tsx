import { effect, peek, provideContext } from 'maverick.js';
import {
  Component,
  ComponentInstance,
  defineElement,
  type HTMLCustomElement,
} from 'maverick.js/element';
import { ariaBool, setStyle } from 'maverick.js/std';

import { FocusVisibleController } from '../../../../foundation/observers/focus-visible';
import { setAttributeIfEmpty } from '../../../../utils/dom';
import { round } from '../../../../utils/number';
import { useMedia, type MediaContext } from '../../../core/api/context';
import type { SliderCSSVars } from './api/cssvars';
import type {
  SliderDragEndEvent,
  SliderDragStartEvent,
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './api/events';
import { sliderProps, type SliderProps } from './api/props';
import { SliderStoreFactory } from './api/store';
import { SliderEventsController } from './events-controller';
import { sliderValueFormatContext } from './format';
import { getClampedValue } from './utils';

declare global {
  interface MaverickElements {
    'media-slider': MediaSliderElement;
  }
}

/**
 * A custom-built range input that is cross-browser friendly, ARIA friendly, mouse/touch-friendly
 * and easily style-able. The slider allows users to input numeric values between a minimum and
 * maximum value.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider}
 * @example
 * ```html
 * <media-slider min="0" max="100" value="50" aria-label="..."></media-slider>
 * ```
 */
export class Slider<T extends SliderAPI = SliderAPI> extends Component<T> {
  static el = defineElement<SliderAPI>({
    tagName: 'media-slider',
    props: sliderProps,
    store: SliderStoreFactory,
  });

  protected _media: MediaContext;
  protected _readonly = false;

  _orientation = '';

  constructor(instance: ComponentInstance<T>) {
    super(instance);

    provideContext(sliderValueFormatContext);

    this._media = useMedia();

    new SliderEventsController(instance, this, this._media);

    const focus = new FocusVisibleController(instance);
    // @ts-expect-error - overwrite readonly
    this.$store.focused = focus.focused.bind(focus);
  }

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'role', 'slider');
    setAttributeIfEmpty(el, 'tabindex', '0');
    setAttributeIfEmpty(el, 'aria-orientation', 'horizontal');
    setAttributeIfEmpty(el, 'autocomplete', 'off');

    this._orientation = el.getAttribute('aria-orientation') || '';

    if (!this._readonly) {
      effect(this._watchMinMax.bind(this));
      effect(this._watchDisabled.bind(this));
    }

    effect(this._watchValue.bind(this));

    this._setAttrs();
  }

  protected override onConnect(el: HTMLElement) {
    this._setupPreview();
  }

  override render() {
    const { trackClass, trackFillClass, trackProgressClass, thumbContainerClass, thumbClass } =
      this.$props;
    return (
      <>
        <div class={trackClass()} part="track" />
        <div class={trackFillClass()} part="track track-fill" />
        <div class={trackProgressClass()} part="track track-progress" />
        <div class={thumbContainerClass()} part="thumb-container">
          <div class={thumbClass()} part="thumb" />
        </div>
      </>
    );
  }

  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------

  _getStep() {
    return this.$props.step();
  }

  _getKeyStep() {
    return this.$props.keyStep();
  }

  _roundValue(value: number) {
    return Math.round(value);
  }

  _isDisabled() {
    return this.$props.disabled();
  }

  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------

  protected _watchMinMax() {
    const { min, max } = this.$props;
    this.$store.min.set(min());
    this.$store.max.set(max());
  }

  protected _watchDisabled() {
    if (!this._isDisabled()) return;
    const { dragging, pointing } = this.$store;
    dragging.set(false);
    pointing.set(false);
  }

  protected _watchValue() {
    const { dragging, value, min, max } = this.$store;
    if (peek(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this._getStep()));
  }

  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------

  protected _getARIADisabled() {
    return ariaBool(this._isDisabled());
  }

  protected _getARIAValueMin() {
    return this.$props.min();
  }

  protected _getARIAValueMax() {
    return this.$props.max();
  }

  protected _getARIAValueNow() {
    const { value } = this.$store;
    return Math.round(value());
  }

  protected _getARIAValueText() {
    const { value, max } = this.$store;
    return round((value() / max()) * 100, 2) + '%';
  }

  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------

  protected _setAttrs() {
    const { disabled } = this.$props,
      { dragging, fillPercent, interactive, pointerPercent, pointing } = this.$store;

    this.setAttributes({
      disabled,
      'data-dragging': dragging,
      'data-pointing': pointing,
      'data-interactive': interactive,
      'aria-disabled': this._getARIADisabled.bind(this),
      'aria-valuemin': this._getARIAValueMin.bind(this),
      'aria-valuemax': this._getARIAValueMax.bind(this),
      'aria-valuenow': this._getARIAValueNow.bind(this),
      'aria-valuetext': this._getARIAValueText.bind(this),
      'data-styled': this._isStyled.bind(this),
      'data-media-slider': true,
    });

    this.setCSSVars<SliderCSSVars>({
      '--slider-fill-percent': () => round(fillPercent(), 3) + '%',
      '--slider-pointer-percent': () => round(pointerPercent(), 3) + '%',
    });
  }

  protected _isStyled() {
    return !!this.$props.trackClass();
  }

  // -------------------------------------------------------------------------------------------
  // Preview
  // -------------------------------------------------------------------------------------------

  protected _preview: HTMLElement | null = null;
  protected _setupPreview() {
    this._preview = this.el!.querySelector('[slot="preview"]') as HTMLElement;
    if (!this._preview) return;
    effect(this._watchPreview.bind(this));
    import('./preview').then(({ setupPreviewStyles }) => {
      setupPreviewStyles(this._preview!, this._orientation);
    });
  }

  protected _watchPreview() {
    if (this._isDisabled() || !this._preview) return;
    const onResize = this._onPreviewResize.bind(this);
    window.requestAnimationFrame(onResize);
    const observer = new ResizeObserver(onResize);
    observer.observe(this._preview);
    return () => observer.disconnect();
  }

  protected _onPreviewResize() {
    if (!this._preview) return;
    const rect = this._preview.getBoundingClientRect();
    setStyle(this._preview, '--computed-width', rect.width + 'px');
    setStyle(this._preview, '--computed-height', rect.height + 'px');
  }

  // -------------------------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------------------------

  _onValueChange(event: SliderValueChangeEvent) {}
  _onDragStart(event: SliderDragStartEvent) {}
  _onDragEnd(event: SliderDragEndEvent) {}
  _onDragValueChange(event: SliderDragValueChangeEvent) {}
}

export interface SliderAPI {
  props: SliderProps;
  events: SliderEvents;
  cssvars: SliderCSSVars;
  store: typeof SliderStoreFactory;
}

export interface MediaSliderElement extends HTMLCustomElement<Slider> {}
