import { scrollTop } from '../stores/scroll';
import { IS_BROWSER } from '../utils/env';

if (IS_BROWSER) {
  function onScroll(top: number) {
    const el = document.body;
    el.toggleAttribute('data-scrolled', top > 0);
  }

  scrollTop.subscribe(onScroll);
}
