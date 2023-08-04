import { IS_BROWSER } from './env';
import { noop } from './unit';

export function inBounds(el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function hasAnimation(el: HTMLElement): boolean {
  const styles = getComputedStyle(el);
  return styles.animationName !== 'none';
}

export function isAstroSlot(el: unknown): el is HTMLElement {
  return el instanceof HTMLElement && el.localName === 'astro-slot';
}

export function animationFrameThrottle<Fn extends (...args: any[]) => void>(func: Fn): Fn {
  if (!IS_BROWSER) return noop as Fn;

  let id = -1,
    lastArgs: any[] | undefined;

  function throttle(this: any, ...args: any[]) {
    lastArgs = args;
    if (id >= 0) return;
    id = window.requestAnimationFrame(() => {
      func.apply(this, lastArgs as any[]);
      id = -1;
      lastArgs = undefined;
    });
  }

  return throttle as Fn;
}
