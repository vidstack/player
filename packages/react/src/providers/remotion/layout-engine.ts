import { animationFrameThrottle, createDisposalBin } from 'maverick.js/std';

import type { RemotionSrc } from './types';

export class RemotionLayoutEngine {
  #src: RemotionSrc | null = null;
  #viewport: HTMLElement | null = null;
  #canvas: HTMLElement | null = null;
  #container: HTMLElement | null = null;
  #disposal = createDisposalBin();

  constructor() {}

  setSrc(src: RemotionSrc | null) {
    this.#src = src;
    this.setContainer(this.#container);
  }

  setContainer(container: HTMLElement | null) {
    if (__SERVER__) return;

    this.#disposal.empty();

    this.#container = container;
    this.#canvas = container?.parentElement ?? null;
    this.#viewport = this.#canvas?.parentElement ?? null;

    if (this.#src && this.#viewport) {
      const onResize = animationFrameThrottle(this.#onResize.bind(this));

      onResize();
      const observer = new ResizeObserver(onResize);
      observer.observe(this.#viewport);

      this.#disposal.add(() => observer.disconnect());
    }
  }

  destroy() {
    this.#disposal.empty();
  }

  #onResize(entries?: ResizeObserverEntry[]) {
    if (!this.#viewport || !this.#src) return;

    const rect = this.#getRect(this.#viewport, entries?.[0]),
      scale = this.#calcScale(rect),
      transform = this.#calcTransform(rect, scale);

    Object.assign(this.#canvas!.style, {
      width: this.#src.compositionWidth! * scale + 'px',
      height: this.#src.compositionHeight! * scale + 'px',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      left: transform.centerX,
      top: transform.centerY,
      overflow: 'hidden',
    });

    Object.assign(this.#container!.style, {
      position: 'absolute',
      width: this.#src.compositionWidth + 'px',
      height: this.#src.compositionHeight + 'px',
      display: 'flex',
      transform: `scale(${scale})`,
      marginLeft: transform.x,
      marginTop: transform.y,
      overflow: 'hidden',
    });
  }

  #getRect(el: HTMLElement, entry?: ResizeObserverEntry): LayoutRect {
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

  #calcScale(rect: LayoutRect) {
    if (!this.#src) return 0;

    const heightRatio = rect.height / this.#src.compositionHeight!,
      widthRatio = rect.width / this.#src.compositionWidth!;

    return Math.min(heightRatio || 0, widthRatio || 0);
  }

  #calcTransform(rect: LayoutRect, scale: number) {
    if (!this.#src) return {};

    const correction = 0 - (1 - scale) / 2,
      x = correction * this.#src.compositionWidth!,
      y = correction * this.#src.compositionHeight!,
      width = this.#src.compositionWidth! * scale,
      height = this.#src.compositionHeight! * scale,
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
