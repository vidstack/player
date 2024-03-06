import { Component, effect, onDispose, useContext, useState } from 'maverick.js';
import { animationFrameThrottle } from 'maverick.js/std';

import { Slider } from './slider/slider';
import { sliderContext, type SliderContext } from './slider/slider-context';
import type { SliderOrientation } from './slider/types';

/**
 * Used to provide users with a real-time or interactive preview of the value or selection they
 * are making as they move the slider thumb. This can include displaying the current pointer
 * value numerically, or displaying a thumbnail over the time slider.
 *
 * @attr data-visible - Whether the preview is visible.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/slider#preview}
 */
export class SliderPreview extends Component<SliderPreviewProps> {
  static props: SliderPreviewProps = {
    offset: 0,
    noClamp: false,
  };

  private _slider!: SliderContext;

  protected override onSetup(): void {
    this._slider = useContext(sliderContext);

    const { active } = useState(Slider.state);
    this.setAttributes({
      'data-visible': active,
    });
  }

  protected override onAttach(el: HTMLElement): void {
    Object.assign(el.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'max-content',
    });
  }

  protected override onConnect(el: HTMLElement): void {
    const { _preview } = this._slider;
    _preview.set(el);
    onDispose(() => _preview.set(null));

    effect(this._updatePlacement.bind(this));

    const resize = new ResizeObserver(this._updatePlacement.bind(this));
    resize.observe(el);
    onDispose(() => resize.disconnect());
  }

  private _updatePlacement = animationFrameThrottle(() => {
    const { _disabled, _orientation } = this._slider;

    if (_disabled()) return;

    const el = this.el,
      { offset, noClamp } = this.$props;

    if (!el) return;

    updateSliderPreviewPlacement(el, {
      clamp: !noClamp(),
      offset: offset(),
      orientation: _orientation(),
    });
  });
}

export function updateSliderPreviewPlacement(
  el: HTMLElement,
  {
    clamp,
    offset,
    orientation,
  }: {
    clamp: boolean;
    offset: number;
    orientation: SliderOrientation;
  },
) {
  const computedStyle = getComputedStyle(el),
    width = parseFloat(computedStyle.width),
    height = parseFloat(computedStyle.height),
    styles: Record<string, string | null> = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

  styles[orientation === 'horizontal' ? 'bottom' : 'left'] =
    `calc(100% + var(--media-slider-preview-offset, ${offset}px))`;

  if (orientation === 'horizontal') {
    const widthHalf = width / 2;
    if (!clamp) {
      styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
    } else {
      const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`,
        rightClamp = `calc(100% - ${width}px)`;
      styles.left = `min(${leftClamp}, ${rightClamp})`;
    }
  } else {
    const heightHalf = height / 2;
    if (!clamp) {
      styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
    } else {
      const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`,
        bottomClamp = `calc(100% - ${height}px)`;
      styles.bottom = `min(${topClamp}, ${bottomClamp})`;
    }
  }

  Object.assign(el.style, styles);
}

export interface SliderPreviewProps {
  /**
   * The distance in pixels between the preview and the slider. You can also set
   * the CSS variable `--media-slider-preview-offset` to adjust this offset.
   */
  offset: number;
  /**
   * By default, the preview will be clamped to the left and right of the slider track. If this
   * is set to `true`, the preview will flow outside of the container when at the edges.
   */
  noClamp: boolean;
}
