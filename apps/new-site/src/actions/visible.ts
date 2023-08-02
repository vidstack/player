import type { ActionReturn } from 'svelte/action';

export interface VisibleActionOptions extends IntersectionObserverInit {
  once?: boolean;
  onChange?(isVisible: boolean): void;
}

export function visible(
  el: HTMLElement,
  options?: VisibleActionOptions,
): ActionReturn<IntersectionObserverInit> {
  let observer = createObserver(el, options);
  observer.observe(el);

  return {
    update(init) {
      observer.disconnect();
      observer = createObserver(el, init);
      observer.observe(el);
    },
    destroy() {
      observer.disconnect();
    },
  };
}

function createObserver(el: HTMLElement, options?: VisibleActionOptions) {
  const observer = new IntersectionObserver(([entry]) => {
    const isVisible = entry.isIntersecting;

    if (isVisible) {
      el.setAttribute('data-visible', '');
      el.removeAttribute('data-invisible');
      if (options?.once) observer.disconnect();
    } else {
      el.setAttribute('data-invisible', '');
      el.removeAttribute('data-visible');
    }

    options?.onChange?.(isVisible);
  }, options);

  return observer;
}
