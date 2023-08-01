import type { ActionReturn } from 'svelte/action';

export function visible(
  el: HTMLElement,
  init?: IntersectionObserverInit & { once?: boolean },
): ActionReturn<IntersectionObserverInit> {
  let observer = createObserver(el, init);
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

function createObserver(el: HTMLElement, init?: IntersectionObserverInit & { once?: boolean }) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.setAttribute('data-visible', '');
      el.removeAttribute('data-invisible');
      if (init?.once) observer.disconnect();
    } else {
      el.setAttribute('data-invisible', '');
      el.removeAttribute('data-visible');
    }
  }, init);

  return observer;
}
