export interface ResizeObserverOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), and `border-box`.
   *
   * @default 'content-box'
   */
  box?: 'content-box' | 'border-box';
}

export interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

export declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void;

export interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>;
}

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}
