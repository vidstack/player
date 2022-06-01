import { readable } from 'svelte/store';

import { env } from '$src/env';
import { throttleAndDebounce } from '$src/utils/timing';

export const scrollTop = readable(0, (set) => {
  if (!env.browser) return;

  const onScroll = throttleAndDebounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    set(scrollTop);
  }, 50);

  window.addEventListener('scroll', onScroll, false);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
});

export const scrollDirection = readable<'none' | 'up' | 'down'>('none', (set) => {
  if (!env.browser) return;

  let lastScrollTop = 0;

  const unsub = scrollTop.subscribe(($scrollTop) => {
    if ($scrollTop > lastScrollTop) {
      set('down');
    } else {
      set('up');
    }

    lastScrollTop = $scrollTop <= 0 ? 0 : $scrollTop;
  });

  return () => {
    unsub();
    lastScrollTop = 0;
  };
});
