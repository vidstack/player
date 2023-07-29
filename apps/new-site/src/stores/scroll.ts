import { readable } from 'svelte/store';
import { IS_BROWSER } from '../utils/env';
import { throttleAndDebounce } from '../utils/timing';

export const scrollTop = readable(0, (set) => {
  if (!IS_BROWSER) return;

  const onScroll = throttleAndDebounce(() => {
    const scrollTop = document.documentElement.scrollTop;
    set(scrollTop);
  }, 50);

  window.addEventListener('scroll', onScroll, false);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
});

export const scrollDirection = readable<'none' | 'up' | 'down'>('none', (set) => {
  if (!IS_BROWSER) return;

  let lastScrollTop = 0;

  const unsub = scrollTop.subscribe(($scrollTop) => {
    if ($scrollTop > lastScrollTop) {
      set('down');
    } else if (lastScrollTop - $scrollTop > 240) {
      set('up');
    }

    lastScrollTop = $scrollTop <= 0 ? 0 : $scrollTop;
  });

  return () => {
    unsub();
    lastScrollTop = 0;
  };
});
