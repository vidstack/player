import { IS_BROWSER } from './env';
import { isWindow } from './unit';

export function hideDocumentScrollbar(hidden: boolean) {
  if (!IS_BROWSER) return;
  window.requestAnimationFrame(() => {
    document.documentElement.classList[hidden ? 'add' : 'remove']('overflow-hidden');
    document.documentElement.classList[!hidden ? 'add' : 'remove']('overflow-x-hidden');
  });
}

export function scrollIntoCenter(
  scroll: Element | Window,
  element: Element,
  options: { offset?: number; behaviour?: 'auto' | 'smooth' } = {},
) {
  const scrollTop = isWindow(scroll) ? window.pageYOffset : scroll.scrollTop;
  const scrollHeight = isWindow(scroll)
    ? window.innerHeight
    : scroll.getBoundingClientRect().height;
  const elementRect = element.getBoundingClientRect();
  const center = elementRect.top + scrollTop - scrollHeight / 2;
  scroll.scrollTo({
    top: center + (options?.offset ?? 0),
    behavior: options.behaviour,
  });
}
