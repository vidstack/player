import { compute, type Options as ComputeScrollOptions } from 'compute-scroll-into-view';

export interface ScrollIntoViewOptions extends ComputeScrollOptions, ScrollOptions {}

export function scrollIntoView(el: HTMLElement, options: ScrollIntoViewOptions) {
  const scrolls = compute(el, options);
  for (const { el, top, left } of scrolls) {
    el.scroll({ top, left, behavior: options.behavior });
  }
}

export function scrollIntoCenter(el: HTMLElement, options: ScrollIntoViewOptions = {}) {
  scrollIntoView(el, {
    scrollMode: 'if-needed',
    block: 'center',
    inline: 'center',
    ...options,
  });
}
