import type { ActionReturn } from 'svelte/action';

export interface ResizeActionOptions {
  onResize?(entry: ResizeObserverEntry): void;
}

export function resize(
  el: HTMLElement,
  options?: ResizeActionOptions,
): ActionReturn<IntersectionObserverInit> {
  const observer = new ResizeObserver(([entry]) => {
    options?.onResize?.(entry);
  });

  observer.observe(el);
  return {
    destroy() {
      observer.disconnect();
    },
  };
}
