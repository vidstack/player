import { animationFrameThrottle, createDisposalBin } from 'maverick.js/std';

import type { RemotionSrc } from './types';

export class RemotionLayoutEngine {
  protected _src: RemotionSrc | null = null;
  protected _viewport: HTMLElement | null = null;
  protected _canvas: HTMLElement | null = null;
  protected _container: HTMLElement | null = null;
  protected _disposal = createDisposalBin();

  constructor() {}

  setSrc(src: RemotionSrc | null) {
    this._src = src;
    this.setContainer(this._container);
  }

  setContainer(container: HTMLElement | null) {
    if (__SERVER__) return;

    this._disposal.empty();

    this._container = container;
    this._canvas = container?.parentElement ?? null;
    this._viewport = this._canvas?.parentElement ?? null;

    if (this._src && this._viewport) {
      const onResize = animationFrameThrottle(this._onResize.bind(this));

      onResize();
      const observer = new ResizeObserver(onResize);
      observer.observe(this._viewport);

      this._disposal.add(() => observer.disconnect());
    }
  }

  destroy() {
    this._disposal.empty();
  }

  protected _onResize(entries?: ResizeObserverEntry[]) {
    if (!this._viewport || !this._src) return;

    const rect = this._getRect(this._viewport, entries?.[0]),
      scale = this._calcScale(rect),
      transform = this._calcTransform(rect, scale);

    Object.assign(this._canvas!.style, {
      width: this._src.compositionWidth! * scale + 'px',
      height: this._src.compositionHeight! * scale + 'px',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      left: transform.centerX,
      top: transform.centerY,
      overflow: 'hidden',
    });

    Object.assign(this._container!.style, {
      position: 'absolute',
      width: this._src.compositionWidth + 'px',
      height: this._src.compositionHeight + 'px',
      display: 'flex',
      transform: `scale(${scale})`,
      marginLeft: transform.x,
      marginTop: transform.y,
      overflow: 'hidden',
    });
  }

  protected _getRect(el: HTMLElement, entry?: ResizeObserverEntry): LayoutRect {
    const rect = el.getBoundingClientRect();
    if (!entry) return rect;

    const { contentRect, target } = entry,
      newSize = target.getClientRects();

    if (!newSize?.[0]) return rect;

    const scale = contentRect.width === 0 ? 1 : newSize[0].width / contentRect.width,
      width = newSize[0].width * (1 / scale),
      height = newSize[0].height * (1 / scale);

    return {
      width,
      height,
      top: newSize[0].y,
      left: newSize[0].x,
    };
  }

  protected _calcScale(rect: LayoutRect) {
    if (!this._src) return 0;

    const heightRatio = rect.height / this._src.compositionHeight!,
      widthRatio = rect.width / this._src.compositionWidth!;

    return Math.min(heightRatio || 0, widthRatio || 0);
  }

  protected _calcTransform(rect: LayoutRect, scale: number) {
    if (!this._src) return {};

    const correction = 0 - (1 - scale) / 2,
      x = correction * this._src.compositionWidth!,
      y = correction * this._src.compositionHeight!,
      width = this._src.compositionWidth! * scale,
      height = this._src.compositionHeight! * scale,
      centerX = rect.width / 2 - width / 2,
      centerY = rect.height / 2 - height / 2;

    return { x, y, centerX, centerY };
  }
}

interface LayoutRect {
  width: number;
  height: number;
  top: number;
  left: number;
}
